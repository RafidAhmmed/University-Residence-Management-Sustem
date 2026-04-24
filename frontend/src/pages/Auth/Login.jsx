import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { authAPI } from "../../api/authApi";

const STUDENT_EMAIL_DOMAIN = "student.just.edu.bd";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
    name: "",
    email: "",
    gender: "",
    phone: "",
    dateOfBirth: "",
    session: "",
    department: "",
    bloodGroup: "",
    homeTown: "",
    allocatedHall: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerOptions, setRegisterOptions] = useState({ sessions: [], departments: [], halls: [] });
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    const fetchRegisterOptions = async () => {
      if (!isRegister) return;
      setOptionsLoading(true);
      try {
        const response = await authAPI.getRegisterOptions();
        setRegisterOptions({
          sessions: response.data?.sessions || [],
          departments: response.data?.departments || [],
          halls: response.data?.halls || [],
        });
      } catch (error) {
        console.error('Failed to load register options:', error);
        toast.error('Failed to load session/department/hall options');
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchRegisterOptions();
  }, [isRegister]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user/profile", { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isRegister) {
      // Validate Name
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!formData.department.trim()) {
        newErrors.email = "Select a department first";
      } else if (/^\d{6,8}$/.test(formData.studentId.trim())) {
        const selectedDepartment = registerOptions.departments.find(
          (department) => department.name === formData.department.trim()
        );
        const departmentCode = String(selectedDepartment?.code || "").trim().toLowerCase();
        const studentId = formData.studentId.trim();
        const expectedEmail = `${studentId}.${departmentCode}@${STUDENT_EMAIL_DOMAIN}`;

        if (!departmentCode) {
          newErrors.email = "Department code is missing for the selected department";
        } else if (formData.email.trim().toLowerCase() !== expectedEmail) {
          newErrors.email = `Use your varsity email: ${expectedEmail}`;
        }
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      }

      if (!formData.session.trim()) {
        newErrors.session = "Session is required";
      }

      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }

      if (!formData.allocatedHall.trim()) {
        newErrors.allocatedHall = "Hall is required";
      }

      if (!formData.bloodGroup) {
        newErrors.bloodGroup = "Blood group is required";
      }

      if (!formData.homeTown.trim()) {
        newErrors.homeTown = "Home town is required";
      }

      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      }
    }

    // Validate Student ID
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else {
      const input = formData.studentId.trim();
      const isStudentID = /^\d{6,8}$/.test(input);

      if (!isStudentID) {
        newErrors.studentId =
          "Enter your 6-8 digit Student ID (e.g., 20012001)";
      }
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        const registerData = {
          ...formData,
          name: formData.name.trim(),
          studentId: formData.studentId.trim(),
          email: formData.email.trim().toLowerCase(),
          gender: formData.gender,
          phone: formData.phone.trim(),
          session: formData.session.trim(),
          department: formData.department.trim(),
          homeTown: formData.homeTown.trim(),
          allocatedHall: formData.allocatedHall,
        };

        await authAPI.requestRegisterOtp(registerData);
        toast.success("OTP sent to your email. Verify to complete registration.");
        navigate("/verify-otp", {
          state: {
            purpose: "register",
            email: registerData.email,
          },
        });
      } else {
        const response = await login(formData);
        toast.success("Login successful!");

        // Redirect based on role
        const from =
          location.state?.from?.pathname ||
          (response.user.role === "admin" ? "/admin" : "/user/profile");
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative max-w-6xl">
        <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-start">
          {/* Left Side - Login Card */}
          <div className="order-2 md:order-1">
            {/* Login Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg">
              {/* Logo and Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden border-2 border-red-500">
                  <img
                    src="/logo.png"
                    alt="JUST Hall Management Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Hall Management
                  </h2>
                  <p className="text-xs sm:text-sm text-[#19aaba] font-semibold">
                    Jashore University of Science and Technology
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {isRegister ? "Create Account" : "Welcome Back!"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isRegister
                    ? "Register for the hall management system"
                    : "Enter your Student ID and password to access the hall management system"
                  }
                </p>
              </div>

              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrors({});
                    setFormData({
                      studentId: "",
                      password: "",
                      name: "",
                      email: "",
                      gender: "",
                      phone: "",
                      dateOfBirth: "",
                      session: "",
                      department: "",
                      bloodGroup: "",
                      homeTown: "",
                      allocatedHall: "",
                    });
                  }}
                  className="text-[#19aaba] hover:text-[#17a2b8] text-sm font-medium"
                >
                  {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Name Input - Only for Register */}
                {isRegister && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full pl-3 sm:pl-4 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-colors ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                )}

                {isRegister && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="200107.cse@student.just.edu.bd"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 ${
                            errors.gender ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.gender}</p>
                        )}
                      </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="e.g., 01XXXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Date of Birth
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 ${
                          errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.dateOfBirth}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="session"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Session
                      </label>
                      <select
                        id="session"
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                          errors.session ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={optionsLoading}
                      >
                        <option value="">Select Session</option>
                        {registerOptions.sessions.map((session) => (
                          <option key={session} value={session}>{session}</option>
                        ))}
                      </select>
                      {errors.session && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.session}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="department"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                          errors.department ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={optionsLoading}
                      >
                        <option value="">Select Department</option>
                        {registerOptions.departments.map((department) => (
                          <option key={department.name} value={department.name}>{department.name}</option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.department}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="bloodGroup"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Blood Group
                      </label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 ${
                          errors.bloodGroup ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      {errors.bloodGroup && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.bloodGroup}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="allocatedHall"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Hall
                      </label>
                      <select
                        id="allocatedHall"
                        name="allocatedHall"
                        value={formData.allocatedHall}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 ${
                          errors.allocatedHall ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={optionsLoading}
                      >
                        <option value="">Select Hall</option>
                        {registerOptions.halls.map((hall) => (
                          <option key={hall.name} value={hall.name}>{hall.name}</option>
                        ))}
                      </select>
                      {errors.allocatedHall && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.allocatedHall}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="homeTown"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Home Town
                      </label>
                      <input
                        id="homeTown"
                        name="homeTown"
                        type="text"
                        placeholder="Enter your home town"
                        value={formData.homeTown}
                        onChange={handleChange}
                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                          errors.homeTown ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.homeTown && (
                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.homeTown}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Student ID Input */}
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      placeholder="Enter your Student ID (e.g., 200107)"
                      value={formData.studentId}
                      onChange={handleChange}
                      className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${
                        errors.studentId ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                    />
                  </div>
                  {errors.studentId && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600">
                      {errors.studentId}
                    </p>
                  )}
                  {isRegister && (
                    <p className="mt-1 text-xs text-gray-500">
                      Use this format: studentId.departmentCode@{STUDENT_EMAIL_DOMAIN}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me and Forgot Password */}
                {!isRegister && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#19aaba] focus:ring-[#19aaba] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-xs sm:text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19aaba] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isRegister ? "Registering..." : "Logging in..."}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{isRegister ? "Create Account" : "Log In"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Back to Home */}
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 font-medium text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
