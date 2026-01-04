import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Try to load categories from Supabase
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // If no categories in Supabase, use default categories
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

          // Save default categories to Supabase
          try {
            await supabase.from("categories").upsert(defaultCategories);
            setCategories(defaultCategories);
          } catch (dbError) {
            console.error(
              "Error saving default categories to Supabase:",
              dbError,
            );
            setCategories(defaultCategories);
          }
        }
      } catch (e) {
        console.error("Error loading categories:", e);
        // Use default categories as fallback
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
    };

    // Load categories immediately
    loadCategories();

    // Set up interval to refresh categories every 5 seconds
    const interval = setInterval(loadCategories, 5000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Auto-generate slug from name if the name field is being changed
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData({ ...formData, [name]: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });
  };

  const handleAddCategory = async () => {
    const newCategory = {
      ...formData,
    } as Category;

    try {
      // Try to save to Supabase first
      const { data, error } = await supabase
        .from("categories")
        .insert(newCategory)
        .select();

      if (error) throw error;

      // Update local state with the returned data (which includes the ID)
      if (data && data.length > 0) {
        const updatedCategories = [...categories, data[0]];
        setCategories(updatedCategories);
      }

      resetForm();
      setIsAddDialogOpen(false);
    } catch (e) {
      console.error("Error saving category to Supabase:", e);
      // Generate a temporary ID for local state
      const tempId = Math.max(...categories.map((c) => c.id), 0) + 1;
      const categoryWithId = { ...newCategory, id: tempId };

      // Update local state
      const updatedCategories = [...categories, categoryWithId];
      setCategories(updatedCategories);

      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    const updatedCategory = {
      ...formData,
      id: selectedCategory.id,
      updated_at: new Date().toISOString(),
    } as Category;

    try {
      // Try to update in Supabase first
      const { error } = await supabase
        .from("categories")
        .update(updatedCategory)
        .eq("id", selectedCategory.id);

      if (error) throw error;

      // Update local state
      const updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id ? updatedCategory : category,
      );

      setCategories(updatedCategories);
      setIsEditDialogOpen(false);
    } catch (e) {
      console.error("Error updating category in Supabase:", e);
      // Fallback to local state only
      const updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id ? updatedCategory : category,
      );

      setCategories(updatedCategories);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", selectedCategory.id);

      if (error) throw error;

      // Update local state
      const updatedCategories = categories.filter(
        (category) => category.id !== selectedCategory.id,
      );

      setCategories(updatedCategories);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error("Error deleting category from Supabase:", e);
      // Fallback to local state only
      const updatedCategories = categories.filter(
        (category) => category.id !== selectedCategory.id,
      );

      setCategories(updatedCategories);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Category Management" activeTab="categories">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Enter slug (auto-generated from name)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
                onClick={handleAddCategory}
                disabled={!formData.name || !formData.slug}
              >
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#F5DDEB]/10 transition-colors duration-200"
                >
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {category.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(category)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Enter slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
              onClick={handleEditCategory}
              disabled={!formData.name || !formData.slug}
            >
              Save Changes
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
            Are you sure you want to delete the category "
            {selectedCategory?.name}"? This action cannot be undone and may
            affect products using this category.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
