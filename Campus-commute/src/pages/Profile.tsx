import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit2 } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import BackButton from "@/components/BackButton";
import ImageUploadWithCrop from "@/components/ImageUploadWithCrop";
import PhotoViewer from "@/components/PhotoViewer";
import PhotoOptionsSheet from "@/components/PhotoOptionsSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters");

const emailSchema = z.string().email("Invalid email address");
const phoneSchema = z.string().regex(/^\d{10}$/, "Phone number must be 10 digits");

const branches = ["CSE", "AIML", "IoT", "ECE", "ME", "Others"];
const courses = ["B.Tech", "BCA", "BBA", "M.Tech", "Others"];
const batchYears = ["2026", "2027", "2028", "2029", "2030"];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [course, setCourse] = useState(user?.course || "");
  const [semester, setSemester] = useState(user?.semester || 1);
  const [yearBatch, setYearBatch] = useState(user?.yearBatch || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});

  const getSemesterOptions = () => {
    if (course === "B.Tech") return Array.from({ length: 8 }, (_, i) => i + 1);
    if (course === "BCA") return Array.from({ length: 6 }, (_, i) => i + 1);
    if (course === "BBA") return Array.from({ length: 6 }, (_, i) => i + 1);
    if (course === "M.Tech") return Array.from({ length: 4 }, (_, i) => i + 1);
    return [];
  };

  const handleSave = () => {
    const newErrors: { fullName?: string; email?: string; phone?: string } = {};

    try {
      nameSchema.parse(fullName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        newErrors.fullName = err.errors[0]?.message;
      }
    }

    if (phone) {
      try {
        phoneSchema.parse(phone.replace(/\D/g, ""));
      } catch (err) {
        if (err instanceof z.ZodError) {
          newErrors.phone = err.errors[0]?.message;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateUser({ 
      fullName, 
      phoneNumber: phone,
      branch,
      course,
      semester: parseInt(semester.toString()),
      yearBatch,
      profileImage
    });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleImageSelected = (imageData: string) => {
    setProfileImage(imageData);
    setShowImageUpload(false);
    toast({
      title: "Picture Updated",
      description: "Your profile picture has been updated",
    });
  };

  const handleDeletePhoto = () => {
    setProfileImage("");
    updateUser({ profileImage: "" });
    toast({
      title: "Photo Deleted",
      description: "Your profile picture has been removed",
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/home" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            Profile
          </h1>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <button 
                onClick={() => profileImage && setShowPhotoViewer(true)}
                className={`w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden ${profileImage ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </button>
              <button 
                onClick={() => setShowPhotoOptions(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
              >
                <Edit2 className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 pb-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Full Name (Non-editable)</label>
                <div className="bg-muted rounded-2xl p-4 text-foreground opacity-60">
                  {fullName}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Email (Non-editable)</label>
                <div className="bg-muted rounded-2xl p-4 text-foreground opacity-60">
                  {email}
                </div>
              </div>

              {user?.role === "student" && (
                <>
                  <FormInput
                    label="Phone Number"
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    error={errors.phone}
                  />

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Branch</label>
                    <select 
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="">Select Branch</option>
                      {branches.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Course</label>
                    <select 
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value);
                        setSemester(1);
                      }}
                      className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {getSemesterOptions().length > 0 && (
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Semester</label>
                      <select 
                        value={semester}
                        onChange={(e) => setSemester(parseInt(e.target.value))}
                        className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none"
                      >
                        {getSemesterOptions().map(s => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Batch Year</label>
                    <select 
                      value={yearBatch}
                      onChange={(e) => setYearBatch(e.target.value)}
                      className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="">Select Year</option>
                      {batchYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <div className="pt-4">
                <GradientButton onClick={handleSave}>
                  Save Changes
                </GradientButton>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              <div className="bg-muted rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="text-foreground font-medium">{user?.fullName}</p>
              </div>
              <div className="bg-muted rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              {user?.role === "student" && (
                <>
                  {phone && (
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p className="text-foreground font-medium">{phone}</p>
                    </div>
                  )}
                  {branch && (
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Branch</p>
                      <p className="text-foreground font-medium">{branch}</p>
                    </div>
                  )}
                  {course && (
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Course</p>
                      <p className="text-foreground font-medium">{course}</p>
                    </div>
                  )}
                  {semester && (
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Semester</p>
                      <p className="text-foreground font-medium">Semester {semester}</p>
                    </div>
                  )}
                </>
              )}
              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 px-8 rounded-full font-medium text-lg border-2 border-primary text-primary hover:bg-primary/10 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Viewer Modal */}
      <PhotoViewer imageUrl={profileImage} open={showPhotoViewer} onClose={() => setShowPhotoViewer(false)} />

      {/* Photo Options Sheet */}
      <PhotoOptionsSheet
        open={showPhotoOptions}
        onClose={() => setShowPhotoOptions(false)}
        onCamera={() => setShowImageUpload(true)}
        onGallery={() => setShowImageUpload(true)}
        onAvatar={() => setShowImageUpload(true)}
        onDelete={handleDeletePhoto}
        hasPhoto={!!profileImage}
      />

      {/* Image Upload with Crop */}
      {showImageUpload && (
        <ImageUploadWithCrop
          onImageSave={handleImageSelected}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </MobileLayout>
  );
};

export default Profile;
