import { FaGoogle } from "react-icons/fa";
import { signInWithEmail, signInWithGoogle } from "../../Services/auth-service";
import useForm from "../../Hooks/useForm";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const initialState = {
    email: '',
    password: ''
};

const Login = () => {
    const { formValues, handleInputChange } = useForm(initialState);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = formValues;
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
            console.error("Error en handleSubmit:", error);
            setError(error);
        } else {
            console.log("Inicio de sesión exitoso:", user);
            setError(null);
            navigate('/home');
        }
    };

    const handleLoginGoogle = async () => {
        setError(null);
        try {
            const { data, error } = await signInWithGoogle();
            if (error) throw error;
            // La redirección será manejada por Supabase
        } catch (error) {
            console.error('Error durante el inicio de sesión con Google:', error);
            setError("Ocurrió un error durante el inicio de sesión con Google. Por favor, intenta de nuevo.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formValues.email} 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formValues.password} 
                    onChange={handleInputChange} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <button onClick={handleLoginGoogle}>
                <FaGoogle /> Login with Google
            </button>
            <Link to="/register">No estás registrado? Regístrate</Link>
        </div>
    );
};

export default Login;