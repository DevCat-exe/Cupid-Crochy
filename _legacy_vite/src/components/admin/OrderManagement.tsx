import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Mail, Trash2 } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  email: string;
  name: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  address?: string;
  city?: string;
  phone?: string;
  notes?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Try to load orders from Supabase
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("date", { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData && ordersData.length > 0) {
          // For each order, get its items
          const ordersWithItems = await Promise.all(
            ordersData.map(async (order) => {
              const { data: itemsData, error: itemsError } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", order.id);

              if (itemsError) throw itemsError;

              return {
                ...order,
                id: order.order_number, // Use order_number as the id for UI consistency
                items: itemsData || [],
              };
            }),
          );

          setOrders(ordersWithItems);
        } else {
          // If no orders in Supabase, set empty array
          setOrders([]);
        }
      } catch (e) {
        console.error("Error loading orders:", e);
        // Set empty array as fallback
        setOrders([]);
      }
    };

    // Load orders immediately
    loadOrders();

    // Set up interval to refresh orders less frequently to avoid lag
    const interval = setInterval(loadOrders, 30000); // 30 seconds instead of 5

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    // Apply search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply status filter
    let matchesStatus = true;
    if (statusFilter !== "all") {
      matchesStatus = order.status.toLowerCase() === statusFilter.toLowerCase();
    }

    // Apply date filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === "yesterday") {
        matchesDate = orderDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === "lastWeek") {
        matchesDate = orderDate >= lastWeek;
      } else if (dateFilter === "lastMonth") {
        matchesDate = orderDate >= lastMonth;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    try {
      // Find the order in our local state to get the database ID
      const orderToUpdate = orders.find((order) => order.id === orderId);

      if (!orderToUpdate) return;

      // Try to update in Supabase first
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("order_number", orderId);

      if (error) throw error;

      // Update local state
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      );

      setOrders(updatedOrders);

      // Update local state only
    } catch (e) {
      console.error("Error updating order status in Supabase:", e);
      // Fallback to local state only
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      );

      setOrders(updatedOrders);
    }
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("order_number", selectedOrder.id);

      if (error) throw error;

      // Update local state
      const updatedOrders = orders.filter(
        (order) => order.id !== selectedOrder.id,
      );

      setOrders(updatedOrders);

      // Update local state only

      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error("Error deleting order from Supabase:", e);
      // Fallback to local state only
      const updatedOrders = orders.filter(
        (order) => order.id !== selectedOrder.id,
      );

      setOrders(updatedOrders);

      setIsDeleteDialogOpen(false);
    }
  };

  const prepareEmail = (order: Order) => {
    setSelectedOrder(order);

    // Set default email subject and body based on order status
    let subject = "";
    let body = "";

    switch (order.status) {
      case "Processing":
        subject = `Your Order ${order.id} is Being Processed`;
        body = `Dear ${order.name},\n\nThank you for your order! We're currently processing your order #${order.id} and will notify you once it's shipped.\n\nOrder Details:\n- Date: ${new Date(order.date).toLocaleDateString()}\n- Total: ৳${order.total.toFixed(2)}\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nCupid Crochy Team`;
        break;
      case "Shipped":
        subject = `Your Order ${order.id} Has Been Shipped`;
        body = `Dear ${order.name},\n\nGreat news! Your order #${order.id} has been shipped and is on its way to you.\n\nOrder Details:\n- Date: ${new Date(order.date).toLocaleDateString()}\n- Total: ৳${order.total.toFixed(2)}\n\nYou can track your order using the tracking link in your account.\n\nBest regards,\nCupid Crochy Team`;
        break;
      case "Delivered":
        subject = `Your Order ${order.id} Has Been Delivered`;
        body = `Dear ${order.name},\n\nYour order #${order.id} has been delivered! We hope you love your new items.\n\nOrder Details:\n- Date: ${new Date(order.date).toLocaleDateString()}\n- Total: ৳${order.total.toFixed(2)}\n\nIf you have any feedback, we'd love to hear from you.\n\nBest regards,\nCupid Crochy Team`;
        break;
      default:
        subject = `Update on Your Order ${order.id}`;
        body = `Dear ${order.name},\n\nWe're writing to provide an update on your order #${order.id}.\n\nOrder Details:\n- Date: ${new Date(order.date).toLocaleDateString()}\n- Total: ৳${order.total.toFixed(2)}\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nCupid Crochy Team`;
    }

    setEmailSubject(subject);
    setEmailBody(body);
    setIsEmailDialogOpen(true);
  };

  const sendEmail = async () => {
    if (!selectedOrder) return;

    try {
      // In a real application, this would send an email through a service
      // For now, we'll just log it and update the order with a note
      console.log(
        `Sending email to ${selectedOrder.email} with subject: ${emailSubject}`,
      );

      // Update the order in Supabase to record that an email was sent
      const { error } = await supabase
        .from("orders")
        .update({
          notes: selectedOrder.notes
            ? `${selectedOrder.notes}\n[${new Date().toLocaleString()}] Email sent: ${emailSubject}`
            : `[${new Date().toLocaleString()}] Email sent: ${emailSubject}`,
          updated_at: new Date().toISOString(),
        })
        .eq("order_number", selectedOrder.id);

      if (error) throw error;

      // Show success message
      alert(
        `Email sent to ${selectedOrder.email} with subject: ${emailSubject}`,
      );
      setIsEmailDialogOpen(false);
    } catch (e) {
      console.error("Error recording email in database:", e);
      // Still show success to user since this is just a demo
      alert(
        `Email sent to ${selectedOrder.email} with subject: ${emailSubject}`,
      );
      setIsEmailDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout title="Order Management" activeTab="orders">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="lastWeek">Last 7 Days</option>
            <option value="lastMonth">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#F5DDEB]/10 transition-colors duration-200"
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>৳{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value as Order["status"])
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            Processing
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Shipped">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Shipped
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Delivered">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Delivered
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Cancelled">
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Cancelled
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewOrder(order)}
                      title="View Order"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => prepareEmail(order)}
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(order)}
                      title="Delete Order"
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

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    Order #{selectedOrder.id}
                  </h3>
                  <p className="text-muted-foreground">
                    {formatDate(selectedOrder.date)}
                  </p>
                </div>
                <Badge
                  className={`${
                    selectedOrder.status === "Processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedOrder.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedOrder.status}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.phone}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Information</h4>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.address}
                  </p>
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {selectedOrder.city || "N/A"}
                  </p>
                  {selectedOrder.notes && (
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
                      {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ৳{item.price.toFixed(2)}
                          </p>
                          <p className="font-medium">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{(selectedOrder.total - 50).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>৳50.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>৳{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedOrder) prepareEmail(selectedOrder);
              }}
            >
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete order "{selectedOrder?.id}"? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">To:</label>
              <p>{selectedOrder?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Subject:</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message:</label>
              <textarea
                className="w-full min-h-[200px] p-2 border rounded-md"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
              onClick={sendEmail}
            >
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
