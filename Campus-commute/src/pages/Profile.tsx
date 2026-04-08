import { useState, useEffect } from "react";
import { User, Edit2 } from "lucide-react";
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

const phoneSchema = z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits");

const courses = ["B.Tech", "BBA", "BCA", "M.Tech", "MBA"] as const;
type CourseType = typeof courses[number];

const courseConfig: Record<CourseType, { duration: number; semesters: number; branches: string[] }> = {
  "B.Tech": { duration: 4, semesters: 8, branches: ["CSE", "ECE", "ME", "EE", "CE", "Other"] },
  "BBA": { duration: 3, semesters: 6, branches: ["General", "Finance", "Marketing", "HR", "Other"] },
  "BCA": { duration: 3, semesters: 6, branches: ["General", "Data Science", "Web Development", "Other"] },
  "M.Tech": { duration: 2, semesters: 4, branches: ["CSE", "ECE", "ME", "EE", "CE", "Other"] },
  "MBA": { duration: 2, semesters: 4, branches: ["Finance", "Marketing", "HR", "Operations", "Other"] },
};

const busStops = ["Trisulia", "Damana", "Patia", "Fire Station", "ITER"];
const countryCodes = ["+91", "+1", "+44"];

const calculateYearRange = (courseStr: string) => {
  if (!courseStr || !(courseStr in courseConfig)) return "";
  const currentYear = new Date().getFullYear();
  const duration = courseConfig[courseStr as CourseType].duration;
  return `${currentYear} - ${currentYear + duration}`;
};

const calculateSemester = (courseStr: string) => {
  if (!courseStr || !(courseStr in courseConfig)) return "";
  return courseConfig[courseStr as CourseType].semesters.toString();
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.email || ""); // Email is strictly readOnly
  const [registrationNo, setRegistrationNo] = useState(user?.registrationNo || "");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  
  const [course, setCourse] = useState(user?.course || "");
  const [branchSelect, setBranchSelect] = useState("");
  const [branchText, setBranchText] = useState("");

  const [semester, setSemester] = useState(user?.semester || "");
  const [yearBatch, setYearBatch] = useState(user?.yearBatch || "");
  const [busStop, setBusStop] = useState(user?.busStop || "");
  
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  useEffect(() => {
    // Initialize branch selection from user data context
    if (user?.branch) {
      if (user.course && courseConfig[user.course as CourseType]?.branches.includes(user.branch)) {
        setBranchSelect(user.branch);
      } else {
        setBranchSelect("Other");
        setBranchText(user.branch);
      }
    }
  }, [user]);

  const handleCourseChange = (selectedCourse: string) => {
    setCourse(selectedCourse);
    setBranchSelect("");
    setBranchText("");
    
    // Auto-calculate semester and year range
    const newSem = calculateSemester(selectedCourse);
    const newRange = calculateYearRange(selectedCourse);
    setSemester(newSem);
    setYearBatch(newRange);
  };

  const handleSave = () => {
    const newErrors: { fullName?: string; phone?: string } = {};

    try {
      nameSchema.parse(fullName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        newErrors.fullName = err.errors[0]?.message;
      }
    }

    if (phone) {
      try {
        const cleanPhone = phone.replace(/\D/g, "");
        phoneSchema.parse(cleanPhone);
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

    const finalBranch = branchSelect === "Other" ? branchText : branchSelect;

    updateUser({ 
      fullName, 
      registrationNo,
      phoneNumber: phone,
      branch: finalBranch,
      course,
      semester: semester,
      yearBatch,
      busStop,
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
    <div className="min-h-screen bg-muted/50 pb-12">
      <div className="max-w-[430px] md:max-w-5xl mx-auto min-h-screen md:min-h-[auto] bg-background md:mt-8 md:rounded-3xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col px-6 md:px-10 py-6 md:py-10">
          <div className="mb-4 hidden md:block">
            <BackButton to="/home" />
          </div>
          <div className="md:hidden">
            <BackButton to="/home" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center md:text-left mb-8 md:mb-10 pt-4 md:pt-0">
            {isEditing ? "Edit Profile" : "User Profile"}
          </h1>

          <div className={isEditing ? "grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12" : "space-y-6 max-w-2xl mx-auto"}>
            
            {/* Left Card: Avatar & Basic Details */}
            <div className={isEditing ? "col-span-1 md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start" : "flex flex-col items-center"}>
              
              {/* Avatar Section */}
              <div className="relative mb-8 text-center md:text-left w-full flex justify-center md:justify-start">
                <div className="relative inline-block">
                  <button 
                    onClick={() => profileImage && setShowPhotoViewer(true)}
                    className={`w-28 h-28 md:w-36 md:h-36 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-md ${profileImage ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />
                    )}
                  </button>
                  {isEditing && (
                    <button 
                      onClick={() => setShowPhotoOptions(true)}
                      className="absolute bottom-0 right-0 md:bottom-2 md:right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-primary-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Non-Editable details strictly below image on wide screens */}
              {isEditing && (
                <div className="w-full space-y-5">
                  <FormInput
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={errors.fullName}
                  />

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2 font-medium">Email (Non-editable)</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={email}
                      className="w-full bg-muted/70 border border-muted opacity-70 cursor-not-allowed rounded-2xl p-4 text-foreground focus:outline-none"
                    />
                  </div>

                  {user?.role === "student" && (
                    <FormInput
                      label="Registration No."
                      placeholder="Enter Registration No."
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right Card: Full Form Options */}
            {isEditing ? (
              <div className="col-span-1 md:col-span-7 lg:col-span-8 flex flex-col space-y-6">
                
                {user?.role === "student" && (
                  <div className="bg-muted/30 p-6 md:p-8 rounded-3xl border border-muted/50 space-y-6">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Contact & Academic Info</h2>

                    {/* Phone Number Container */}
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2 font-medium">Phone Number</label>
                      <div className="flex gap-3">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-muted border border-transparent rounded-2xl p-4 text-foreground focus:border-primary/30 focus:outline-none w-[100px]"
                        >
                          {countryCodes.map(code => (
                            <option key={code} value={code}>{code}</option>
                          ))}
                        </select>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="10-digit number"
                            value={phone}
                            autoComplete="off"
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setPhone(val.slice(0, 15)); // Allowing typed val, validation handles strict len
                            }}
                            className={`w-full bg-muted border ${errors.phone ? 'border-destructive' : 'border-transparent'} rounded-2xl p-4 text-foreground focus:border-primary/30 focus:outline-none transition-colors`}
                          />
                          {errors.phone && <p className="text-sm text-destructive mt-1 ml-2">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Bus Stop Dropdown */}
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2 font-medium">Bus Stop</label>
                      <select 
                        value={busStop}
                        onChange={(e) => setBusStop(e.target.value)}
                        className="w-full bg-muted appearance-none border border-transparent rounded-2xl p-4 text-foreground focus:border-primary/30 focus:outline-none transition-colors"
                      >
                        <option value="">Select Bus Stop</option>
                        {busStops.map(stop => (
                          <option key={stop} value={stop}>{stop}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2 font-medium">Course</label>
                        <select 
                          value={course}
                          onChange={(e) => handleCourseChange(e.target.value)}
                          className="w-full bg-muted appearance-none border border-transparent rounded-2xl p-4 text-foreground focus:border-primary/30 focus:outline-none transition-colors"
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-muted-foreground mb-2 font-medium">Branch</label>
                        <select 
                          value={branchSelect}
                          onChange={(e) => setBranchSelect(e.target.value)}
                          disabled={!course}
                          className="w-full bg-muted appearance-none border border-transparent rounded-2xl p-4 text-foreground focus:border-primary/30 focus:outline-none transition-colors disabled:opacity-50"
                        >
                          <option value="">Select Branch</option>
                          {course && courseConfig[course as CourseType]?.branches.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      
                      {branchSelect === "Other" && (
                        <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2">
                          <FormInput
                            label="Specify Branch"
                            placeholder="Enter your branch name"
                            value={branchText}
                            onChange={(e) => setBranchText(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Auto-Calculated Form fields */}
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2 font-medium">Total Semesters</label>
                        <input
                          type="text"
                          readOnly
                          disabled
                          placeholder="Auto-calculated"
                          value={semester}
                          className="w-full bg-muted/70 border border-muted opacity-70 cursor-not-allowed rounded-2xl p-4 text-foreground focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-muted-foreground mb-2 font-medium">Academic Year</label>
                        <input
                          type="text"
                          readOnly
                          disabled
                          placeholder="Auto-calculated"
                          value={yearBatch}
                          className="w-full bg-muted/70 border border-muted opacity-70 cursor-not-allowed rounded-2xl p-4 text-foreground focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>
                )}
                
                <div className="pt-4 md:flex md:justify-end md:gap-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="w-full md:w-auto px-8 py-4 bg-muted text-foreground border-transparent rounded-full font-medium hover:bg-muted/80 transition-colors mb-3 md:mb-0"
                  >
                    Cancel
                  </button>
                  <div className="md:w-[200px]">
                    <GradientButton onClick={handleSave}>
                      Save Changes
                    </GradientButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4 md:space-y-6 pb-6 w-full">
                {/* View Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-muted/50 rounded-3xl p-5 md:p-6 border border-muted">
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="text-foreground font-medium text-lg">{user?.fullName}</p>
                  </div>
                  <div className="bg-muted/50 rounded-3xl p-5 md:p-6 border border-muted">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-foreground font-medium text-lg break-all">{user?.email}</p>
                  </div>
                </div>
                
                {user?.role === "student" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-muted/50 rounded-3xl p-5 md:p-6 border border-muted">
                        <p className="text-sm text-muted-foreground mb-1">Registration No.</p>
                        <p className="text-foreground font-medium text-lg">{user?.registrationNo || "Not specified"}</p>
                      </div>
                      <div className="bg-muted/50 rounded-3xl p-5 md:p-6 border border-muted">
                        <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                        <p className="text-foreground font-medium text-lg">{user?.phoneNumber || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-3xl p-5 md:p-6 border border-muted grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Course</p>
                        <p className="text-foreground font-medium">{user?.course || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Branch</p>
                        <p className="text-foreground font-medium">{user?.branch || "N/A"}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-1">Semesters</p>
                        <p className="text-foreground font-medium">{user?.semester || "N/A"}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-1">Academic Year</p>
                        <p className="text-foreground font-medium">{user?.yearBatch || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-3xl p-5 md:p-6 border border-muted">
                      <p className="text-sm text-muted-foreground mb-1">Bus Stop</p>
                      <p className="text-foreground font-medium text-lg">{user?.busStop || "Not specified"}</p>
                    </div>
                  </>
                )}
                <div className="pt-6 flex justify-center">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full md:w-[300px] py-4 px-8 rounded-full font-medium text-lg border-2 border-primary text-primary hover:bg-primary/10 transition-colors shadow-sm"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default Profile;
