import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit2,
  Loader2,
  LogIn,
  LogOut,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { VideoEntry } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddVideo,
  useAllCategories,
  useAllVideos,
  useDeleteVideo,
  useIsAdmin,
  useUpdateVideo,
} from "../hooks/useQueries";

const DEFAULT_CATEGORIES = [
  "80's Music",
  "90's Music",
  "2000's Music",
  "Heavy Metal",
  "Rock",
  "Classic Rock",
  "Pop",
  "Hip Hop / Rap",
  "R&B / Soul",
  "Jazz",
  "Blues",
  "Country",
  "Electronic / Dance",
  "Punk",
  "Indie",
  "Reggae",
  "Latin",
  "Alternative",
];

type VideoFormData = {
  title: string;
  artist: string;
  category: string;
  youtubeUrl: string;
};

const emptyForm: VideoFormData = {
  title: "",
  artist: "",
  category: "",
  youtubeUrl: "",
};

export default function AdminPage() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: videos, isLoading: videosLoading } = useAllVideos();
  const { data: categories } = useAllCategories();
  const addVideo = useAddVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();

  const [addOpen, setAddOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<VideoEntry | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<VideoFormData>(emptyForm);

  const allCategories = [
    ...new Set([...DEFAULT_CATEGORIES, ...(categories ?? [])]),
  ].sort();

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setAddOpen(true);
  };

  const handleOpenEdit = (video: VideoEntry) => {
    setForm({
      title: video.title,
      artist: video.artist,
      category: video.category,
      youtubeUrl: video.youtubeUrl,
    });
    setEditVideo(video);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.artist || !form.category || !form.youtubeUrl) {
      toast.error("All fields are required");
      return;
    }
    try {
      await addVideo.mutateAsync(form);
      toast.success("Video added successfully");
      setAddOpen(false);
      setForm(emptyForm);
    } catch (err) {
      toast.error(
        `Failed to add video: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVideo) return;
    try {
      await updateVideo.mutateAsync({ id: editVideo.id, ...form });
      toast.success("Video updated successfully");
      setEditVideo(null);
    } catch (err) {
      toast.error(
        `Failed to update: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteVideo.mutateAsync(deleteId);
      toast.success("Video deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error(
        `Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  // Not logged in
  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Shield className="w-16 h-16 mx-auto text-primary/50" />
          <h1 className="font-display text-3xl font-bold text-gradient">
            Admin Access
          </h1>
          <p className="text-muted-foreground">
            This area is restricted to administrators. Please login to continue.
          </p>
          <Button
            data-ocid="admin.login_button"
            onClick={login}
            disabled={isLoggingIn}
            className="gap-2 bg-primary hover:bg-primary/80 vault-glow"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
          </Button>
        </div>
      </div>
    );
  }

  // Checking admin status
  if (adminLoading) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Verifying access...</p>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Shield className="w-16 h-16 mx-auto text-destructive/60" />
          <h1 className="font-display text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            Your account does not have admin privileges.
          </p>
          <p className="text-xs text-muted-foreground font-mono bg-secondary px-3 py-2 rounded">
            {identity.getPrincipal().toString()}
          </p>
          <Button
            data-ocid="admin.logout_button"
            variant="outline"
            onClick={clear}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">
            {identity.getPrincipal().toString().slice(0, 20)}...
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            data-ocid="admin.add_button"
            onClick={handleOpenAdd}
            className="gap-2 bg-primary hover:bg-primary/80"
          >
            <Plus className="w-4 h-4" /> Add Video
          </Button>
          <Button
            data-ocid="admin.logout_button"
            variant="outline"
            onClick={clear}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Videos table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="text-foreground">Title</TableHead>
              <TableHead className="text-foreground">Artist</TableHead>
              <TableHead className="text-foreground hidden md:table-cell">
                Category
              </TableHead>
              <TableHead className="text-right text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videosLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10"
                  data-ocid="admin.loading_state"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : (videos?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="video.empty_state"
                >
                  No videos yet. Add your first track!
                </TableCell>
              </TableRow>
            ) : (
              videos?.map((video, i) => (
                <TableRow
                  key={String(video.id)}
                  data-ocid={`admin.row.${i + 1}`}
                  className="hover:bg-secondary/20"
                >
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {video.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {video.artist}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {video.category}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        data-ocid={`admin.edit_button.${i + 1}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(video)}
                        className="w-8 h-8 hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        data-ocid={`admin.delete_button.${i + 1}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(video.id)}
                        className="w-8 h-8 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Video Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="bg-card border-border sm:max-w-md"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-gradient">
              Add New Video
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <VideoFormFields
              form={form}
              setForm={setForm}
              categories={allCategories}
            />
            <DialogFooter className="gap-2">
              <Button
                data-ocid="admin.cancel_button"
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button
                data-ocid="admin.save_button"
                type="submit"
                disabled={addVideo.isPending}
                className="bg-primary hover:bg-primary/80"
              >
                {addVideo.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {addVideo.isPending ? "Adding..." : "Add Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Video Dialog */}
      <Dialog
        open={!!editVideo}
        onOpenChange={(open) => !open && setEditVideo(null)}
      >
        <DialogContent
          className="bg-card border-border sm:max-w-md"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-gradient">
              Edit Video
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <VideoFormFields
              form={form}
              setForm={setForm}
              categories={allCategories}
            />
            <DialogFooter className="gap-2">
              <Button
                data-ocid="admin.cancel_button"
                type="button"
                variant="outline"
                onClick={() => setEditVideo(null)}
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button
                data-ocid="admin.save_button"
                type="submit"
                disabled={updateVideo.isPending}
                className="bg-primary hover:bg-primary/80"
              >
                {updateVideo.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Edit2 className="w-4 h-4 mr-2" />
                )}
                {updateVideo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="delete_confirm.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this video? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="delete_confirm.cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="delete_confirm.confirm_button"
              onClick={handleDelete}
              disabled={deleteVideo.isPending}
              className="bg-destructive hover:bg-destructive/80"
            >
              {deleteVideo.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {deleteVideo.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VideoFormFields({
  form,
  setForm,
  categories,
}: {
  form: VideoFormData;
  setForm: (f: VideoFormData) => void;
  categories: string[];
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          data-ocid="video_form.title_input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter song title"
          className="bg-secondary/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="artist">Artist</Label>
        <Input
          id="artist"
          data-ocid="video_form.artist_input"
          value={form.artist}
          onChange={(e) => setForm({ ...form, artist: e.target.value })}
          placeholder="Enter artist name"
          className="bg-secondary/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.category}
          onValueChange={(val) => setForm({ ...form, category: val })}
        >
          <SelectTrigger
            id="category"
            data-ocid="video_form.category_select"
            className="bg-secondary/50"
          >
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube URL</Label>
        <Input
          id="youtubeUrl"
          data-ocid="video_form.url_input"
          value={form.youtubeUrl}
          onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="bg-secondary/50"
          required
        />
      </div>
    </>
  );
}
