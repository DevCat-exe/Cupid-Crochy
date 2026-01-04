import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isSoldOut?: boolean;
  description?: string;
  features?: string[];
  careInstructions?: string[];
  additionalImages?: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export default function ProductManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<
    Partial<Product> & { tagsInput?: string; newCategory?: string }
  >({
    name: "",
    price: 0,
    image: "",
    category: "",
    tags: [],
    tagsInput: "",
    newCategory: "",
    isNew: false,
    isSoldOut: false,
    description: "",
    features: [],
    careInstructions: [],
    additionalImages: [],
  });

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Default categories if none in database
        const defaultCategories = [
          {
            id: 1,
            name: "Tote",
            slug: "tote",
            description: "Spacious bags with two parallel handles",
          },
          {
            id: 2,
            name: "Crossbody",
            slug: "crossbody",
            description: "Bags worn across the body with a long strap",
          },
          {
            id: 3,
            name: "Bucket",
            slug: "bucket",
            description: "Cylindrical shaped bags with a drawstring closure",
          },
          {
            id: 4,
            name: "Clutch",
            slug: "clutch",
            description: "Small handheld bags without handles",
          },
          {
            id: 5,
            name: "Shoulder",
            slug: "shoulder",
            description:
              "Bags carried on the shoulder with medium-length straps",
          },
          {
            id: 6,
            name: "Handbag",
            slug: "handbag",
            description: "General purpose bags with handles",
          },
        ];
        setCategories(defaultCategories);
      }
    } catch (e) {
      console.error("Error loading categories:", e);
      // Default categories as fallback
      const defaultCategories = [
        {
          id: 1,
          name: "Tote",
          slug: "tote",
          description: "Spacious bags with two parallel handles",
        },
        {
          id: 2,
          name: "Crossbody",
          slug: "crossbody",
          description: "Bags worn across the body with a long strap",
        },
        {
          id: 3,
          name: "Bucket",
          slug: "bucket",
          description: "Cylindrical shaped bags with a drawstring closure",
        },
        {
          id: 4,
          name: "Clutch",
          slug: "clutch",
          description: "Small handheld bags without handles",
        },
        {
          id: 5,
          name: "Shoulder",
          slug: "shoulder",
          description: "Bags carried on the shoulder with medium-length straps",
        },
        {
          id: 6,
          name: "Handbag",
          slug: "handbag",
          description: "General purpose bags with handles",
        },
      ];
      setCategories(defaultCategories);
    }
  }, []);

  useEffect(() => {
    // Load categories
    loadCategories();

    // Load products
    const loadProducts = async () => {
      try {
        // Try to load products from Supabase
        const { data, error } = await supabase
          .from("products")
          .select()
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // No default products
          setProducts([]);
        }
      } catch (e) {
        console.error("Error loading products:", e);
        // No default products
        setProducts([]);
      }
    };

    // Load products immediately
    loadProducts();

    // Set up interval to refresh products less frequently to avoid lag
    const interval = setInterval(loadProducts, 30000); // 30 seconds instead of 5

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [loadCategories]);

  const filteredProducts = products.filter((product) => {
    // Apply search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(product.tags) &&
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ));

    // Apply status filter
    let matchesStatus = true;
    if (statusFilter === "new") {
      matchesStatus = !!product.isNew;
    } else if (statusFilter === "soldout") {
      matchesStatus = !!product.isSoldOut;
    } else if (statusFilter === "available") {
      matchesStatus = !product.isSoldOut;
    }

    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, isNew: checked });
  };

  const handleArrayInputChange = (
    field: string,
    index: number,
    value: string,
  ) => {
    const currentArray = (formData[field as keyof Product] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: string) => {
    const currentArray = (formData[field as keyof Product] as string[]) || [];
    const newArray = [...currentArray, ""];
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = (formData[field as keyof Product] as string[]) || [];
    const newArray = [...currentArray];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    // Store the raw input value to allow typing commas
    setFormData({
      ...formData,
      tagsInput: tagsString,
      tags: tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      image: "",
      category: "",
      tags: [],
      tagsInput: "",
      newCategory: "",
      isNew: false,
      isSoldOut: false,
      description: "",
      features: [],
      careInstructions: [],
      additionalImages: [],
    });
  };

  const handleAddProduct = async () => {
    // Use the new category if provided and no existing category is selected
    const finalCategory = formData.category || formData.newCategory || "";

    // Create the product object without the extra form fields
    const { tagsInput, newCategory, ...productData } = formData;

    const newProduct = {
      ...productData,
      category: finalCategory,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    } as Product;

    try {
      // Try to save to Supabase first
      // Convert arrays to JSON for Supabase
      const productToSave = {
        ...newProduct,
        tags: newProduct.tags || [],
        features: newProduct.features || [],
        care_instructions: newProduct.careInstructions || [],
        additional_images: newProduct.additionalImages || [],
        is_new: newProduct.isNew || false,
        is_sold_out: newProduct.isSoldOut || false,
      };

      console.log("Saving product:", productToSave);
      const { error } = await supabase.from("products").insert(productToSave);

      if (error) throw error;

      // If we have a new category, add it to the categories list
      if (
        formData.newCategory &&
        !categories.some((c) => c.name === formData.newCategory)
      ) {
        const newCategoryObj = {
          id: Date.now(),
          name: formData.newCategory,
          slug: formData.newCategory.toLowerCase().replace(/\s+/g, "-"),
          description: `Category for ${formData.newCategory} products`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          console.log("Adding new category:", newCategoryObj);
          const { error: categoryError } = await supabase
            .from("categories")
            .insert(newCategoryObj);
          if (categoryError) throw categoryError;
          setCategories([...categories, newCategoryObj]);
        } catch (categoryError) {
          console.error("Error adding new category:", categoryError);
          // Still add it to local state
          setCategories([...categories, newCategoryObj]);
        }
      }

      // Update local state
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);

      resetForm();
      setIsAddDialogOpen(false);
    } catch (e) {
      console.error("Error saving product to Supabase:", e);
      // Fallback to local state only
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);

      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    // Use the new category if provided and no existing category is selected
    const finalCategory = formData.category || formData.newCategory || "";

    // Create the product object without the extra form fields
    const { tagsInput, newCategory, ...productData } = formData;

    const updatedProduct = {
      ...productData,
      category: finalCategory,
      id: selectedProduct.id,
      updated_at: new Date().toISOString(),
    } as Product;

    try {
      // Try to update in Supabase first
      // Convert arrays to JSON for Supabase
      const productToSave = {
        ...updatedProduct,
        tags: updatedProduct.tags || [],
        features: updatedProduct.features || [],
        care_instructions: updatedProduct.careInstructions || [],
        additional_images: updatedProduct.additionalImages || [],
        is_new: updatedProduct.isNew || false,
        is_sold_out: updatedProduct.isSoldOut || false,
      };

      console.log("Updating product:", productToSave);
      const { error } = await supabase
        .from("products")
        .update(productToSave)
        .eq("id", selectedProduct.id);

      if (error) throw error;

      // If we have a new category, add it to the categories list
      if (
        formData.newCategory &&
        !categories.some((c) => c.name === formData.newCategory)
      ) {
        const newCategoryObj = {
          id: Date.now(),
          name: formData.newCategory,
          slug: formData.newCategory.toLowerCase().replace(/\s+/g, "-"),
          description: `Category for ${formData.newCategory} products`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          console.log("Adding new category:", newCategoryObj);
          const { error: categoryError } = await supabase
            .from("categories")
            .insert(newCategoryObj);
          if (categoryError) throw categoryError;
          setCategories([...categories, newCategoryObj]);
        } catch (categoryError) {
          console.error("Error adding new category:", categoryError);
          // Still add it to local state
          setCategories([...categories, newCategoryObj]);
        }
      }

      // Update local state
      const updatedProducts = products.map((product) =>
        product.id === selectedProduct.id ? updatedProduct : product,
      );

      setProducts(updatedProducts);
      setIsEditDialogOpen(false);
    } catch (e) {
      console.error("Error updating product in Supabase:", e);
      // Fallback to local state only
      const updatedProducts = products.map((product) =>
        product.id === selectedProduct.id ? updatedProduct : product,
      );

      setProducts(updatedProducts);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);

      if (error) throw error;

      // Update local state
      const updatedProducts = products.filter(
        (product) => product.id !== selectedProduct.id,
      );

      setProducts(updatedProducts);

      // Update local state only

      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error("Error deleting product from Supabase:", e);
      // Fallback to local state only
      const updatedProducts = products.filter(
        (product) => product.id !== selectedProduct.id,
      );

      setProducts(updatedProducts);

      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      tags: Array.isArray(product.tags) ? product.tags : [],
      tagsInput: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      isNew: product.isNew || false,
      isSoldOut: product.isSoldOut || false,
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features : [],
      careInstructions: Array.isArray(product.careInstructions)
        ? product.careInstructions
        : [],
      additionalImages: Array.isArray(product.additionalImages)
        ? product.additionalImages
        : [],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Product Management" activeTab="products">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="h-10 px-3 py-2 rounded-md border border-[#5B1A1A]/20 bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1A1A]/20 focus-visible:ring-offset-2 border-[#5B1A1A]/20 focus:border-[#5B1A1A] text-[#5B1A1A]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="new">New Arrivals</option>
            <option value="soldout">Sold Out</option>
            <option value="available">Available</option>
          </select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-3xl max-h-[90vh] overflow-y-auto"
            aria-describedby="dialog-description"
          >
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-[#5B1A1A]/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1A1A]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#5B1A1A]"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                        {formData.newCategory && (
                          <option value={formData.newCategory}>
                            {formData.newCategory}
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="w-1/3">
                      <Input
                        id="newCategory"
                        name="newCategory"
                        value={formData.newCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newCategory: e.target.value,
                          })
                        }
                        placeholder="New category"
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tagsInput}
                    onChange={handleTagsChange}
                    placeholder="summer, floral, large"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNew"
                      checked={formData.isNew}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="isNew">Mark as New Arrival</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSoldOut"
                      checked={formData.isSoldOut}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isSoldOut: checked })
                      }
                    />
                    <Label htmlFor="isSoldOut">Mark as Sold Out</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Main Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Enter image URL"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <Label>Additional Images</Label>
                <div className="mt-2">
                  {formData.additionalImages &&
                    Array.isArray(formData.additionalImages) &&
                    formData.additionalImages.map((url, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          value={url}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "additionalImages",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder="Enter image URL"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeArrayItem("additionalImages", index)
                          }
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("additionalImages")}
                    className="w-full mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Image
                  </Button>
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="mt-2">
                  {formData.features &&
                    Array.isArray(formData.features) &&
                    formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          value={feature}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "features",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder="Enter feature"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("features", index)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("features")}
                    className="w-full mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Feature
                  </Button>
                </div>
              </div>

              <div>
                <Label>Care Instructions</Label>
                <div className="mt-2">
                  {formData.careInstructions &&
                    Array.isArray(formData.careInstructions) &&
                    formData.careInstructions.map((instruction, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          value={instruction}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "careInstructions",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder="Enter care instruction"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeArrayItem("careInstructions", index)
                          }
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("careInstructions")}
                    className="w-full mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Instruction
                  </Button>
                </div>
              </div>
            </div>
            <p id="dialog-description" className="sr-only">
              Add a new product to your inventory
            </p>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#F5DDEB]/10 transition-colors duration-200"
                >
                  <TableCell>
                    <div className="h-12 w-12 rounded overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    ৳
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(product.tags)
                        ? product.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))
                        : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {product.isNew && (
                        <Badge className="bg-[#5B1A1A] text-white">
                          New Arrival
                        </Badge>
                      )}
                      {product.isSoldOut && (
                        <Badge className="bg-black text-white">Sold Out</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          aria-describedby="edit-dialog-description"
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="edit-price">Price (৳)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select
                      id="edit-category"
                      name="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-[#5B1A1A]/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1A1A]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#5B1A1A]"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      {formData.newCategory && (
                        <option value={formData.newCategory}>
                          {formData.newCategory}
                        </option>
                      )}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <Input
                      id="edit-newCategory"
                      name="newCategory"
                      value={formData.newCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newCategory: e.target.value,
                        })
                      }
                      placeholder="New category"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  value={formData.tagsInput}
                  onChange={handleTagsChange}
                  placeholder="summer, floral, large"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isNew"
                    checked={formData.isNew}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="edit-isNew">Mark as New Arrival</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isSoldOut"
                    checked={formData.isSoldOut}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isSoldOut: checked })
                    }
                  />
                  <Label htmlFor="edit-isSoldOut">Mark as Sold Out</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-image">Main Image URL</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <Label>Additional Images</Label>
              <div className="mt-2">
                {formData.additionalImages &&
                  Array.isArray(formData.additionalImages) &&
                  formData.additionalImages.map((url, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input
                        value={url}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "additionalImages",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter image URL"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeArrayItem("additionalImages", index)
                        }
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("additionalImages")}
                  className="w-full mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Image
                </Button>
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="mt-2">
                {formData.features &&
                  Array.isArray(formData.features) &&
                  formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input
                        value={feature}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "features",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter feature"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("features", index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("features")}
                  className="w-full mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </div>
            </div>

            <div>
              <Label>Care Instructions</Label>
              <div className="mt-2">
                {formData.careInstructions &&
                  Array.isArray(formData.careInstructions) &&
                  formData.careInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input
                        value={instruction}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "careInstructions",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter care instruction"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeArrayItem("careInstructions", index)
                        }
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("careInstructions")}
                  className="w-full mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Instruction
                </Button>
              </div>
            </div>
          </div>
          <p id="edit-dialog-description" className="sr-only">
            Edit product details
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
              onClick={handleEditProduct}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="delete-dialog-description">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{selectedProduct?.name}"? This
            action cannot be undone.
          </p>
          <p id="delete-dialog-description" className="sr-only">
            Confirm product deletion
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
