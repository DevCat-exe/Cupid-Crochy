import { Database } from "@/types/supabase";
import { supabase } from "../../supabase/supabase";

// Re-export the supabase client
export { supabase };

// Products
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select()
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      // Parse JSON fields
      return data.map((product) => ({
        ...product,
        tags:
          typeof product.tags === "string"
            ? JSON.parse(product.tags)
            : Array.isArray(product.tags)
              ? product.tags
              : [],
        features:
          typeof product.features === "string"
            ? JSON.parse(product.features)
            : Array.isArray(product.features)
              ? product.features
              : [],
        careInstructions:
          typeof product.care_instructions === "string"
            ? JSON.parse(product.care_instructions)
            : Array.isArray(product.care_instructions)
              ? product.care_instructions
              : [],
        additionalImages:
          typeof product.additional_images === "string"
            ? JSON.parse(product.additional_images)
            : Array.isArray(product.additional_images)
              ? product.additional_images
              : [],
        isNew: product.is_new,
        isSoldOut: product.is_sold_out,
      }));
    }

    // Return empty array - no default products
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;

    // Parse JSON fields
    if (data) {
      return {
        ...data,
        tags:
          typeof data.tags === "string"
            ? JSON.parse(data.tags)
            : Array.isArray(data.tags)
              ? data.tags
              : [],
        features:
          typeof data.features === "string"
            ? JSON.parse(data.features)
            : Array.isArray(data.features)
              ? data.features
              : [],
        careInstructions:
          typeof data.care_instructions === "string"
            ? JSON.parse(data.care_instructions)
            : Array.isArray(data.care_instructions)
              ? data.care_instructions
              : [],
        additionalImages:
          typeof data.additional_images === "string"
            ? JSON.parse(data.additional_images)
            : Array.isArray(data.additional_images)
              ? data.additional_images
              : [],
        isNew: data.is_new,
        isSoldOut: data.is_sold_out,
      };
    }
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Fallback to localStorage if Supabase fails
    try {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        return products.find((p: any) => p.id === id);
      }
    } catch (e) {
      console.error("Error loading product from localStorage:", e);
    }

    // Return null if product not found
    return null;
  }
}

// Orders
export async function createOrder(orderData: any) {
  try {
    // First create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderData.id,
        email: orderData.email,
        name: orderData.name,
        address: orderData.address,
        phone: orderData.phone,
        city: orderData.city,
        notes: orderData.notes,
        total: orderData.total,
        status: orderData.status || "Processing",
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Then create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error("Error creating order in Supabase:", error);
    // Return the order data anyway so the UI can continue
    return orderData;
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    // Get the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (orderError) throw orderError;

    // Get the order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (itemsError) throw itemsError;

    return { ...order, items: items || [] };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
