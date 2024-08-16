// import { supabase } from "../../Configs/supabaseClient";
// import useForm from "../../Hooks/useForm";
// import { signUpWithEmail, updateProfile } from "../../Services/auth-service";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const initialState = {
//     fullName: '',
//     emailr: '',
//     passwordr: ''
// }

// const Register = () => {
//     const { formValues, handleInputChange, reset } = useForm(initialState)
//     const [userData, setUserData] = useState(null);
//     const navigate = useNavigate();

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const { emailr, passwordr, fullName } = formValues;

//         const data = { email: emailr, password: passwordr };
//         const result = await signUpWithEmail(data);

//         if (result.error) {
//             console.error(result.error);
//             return;
//         }

//         const user = await supabase.auth.getUser();

//         const profileData = {
//             id: user.data.user.id,
//             full_name: fullName
//         };

//         await updateProfile(profileData);

//         setUserData(profileData);
//         reset();

//         navigate('/'); // Navegar a la pantalla de inicio después del registro
//     }

//     return (
//         <div>
//             <h1>Register</h1>
//             <form onSubmit={handleSubmit}>
//                 <label>Full Name</label>
//                 <input
//                     type="text"
//                     name="fullName"
//                     placeholder="Full Name"
//                     value={formValues.fullName}
//                     onChange={handleInputChange}
//                 />
//                 <label>Email</label>
//                 <input
//                     type="text"
//                     name="emailr"
//                     placeholder="Email"
//                     value={formValues.emailr}
//                     onChange={handleInputChange}
//                 />
//                 <label>Password</label>
//                 <input
//                     type="password"
//                     name="passwordr"
//                     placeholder="Password"
//                     value={formValues.passwordr}
//                     onChange={handleInputChange}
//                 />
//                 <button type="submit">Register</button>
//             </form>
//             {userData && (
//                 <div>
//                     <h2>Registration Successful!</h2>
//                     <p>Full Name: {userData.full_name}</p>
//                     <p>User ID: {userData.id}</p>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Register;
