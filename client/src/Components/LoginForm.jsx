import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logoImage from "./Images/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    if (data.token) {
      if (rememberMe) {
        localStorage.setItem("adminToken", data.token);
      } else {
        sessionStorage.setItem("adminToken", data.token);
      }
      // Set a flag in sessionStorage
      sessionStorage.setItem("LoginTime", Date.now());
      onLogin();
      navigate("/admin-panel", { state: { fromLogin: true } });
    } else {
      throw new Error("No token received");
    }
  } catch (err) {
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <LoginContainer>
      <FormCard>
        <LogoContainer>
          <Logo src={logoImage} alt="Logo" />
          <WelcomeText>Hi, Welcome Back</WelcomeText>
          <SubText>Enter your credentials to continue</SubText>
        </LogoContainer>
        <FormContainer onSubmit={handleSubmit}>
          {error && <ErrorText>{error}</ErrorText>}

          <InputGroup>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </InputGroup>

          <InputGroup>
            <InputLabel htmlFor="password">Password</InputLabel>
            <PasswordContainer>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordContainer>
          </InputGroup>

          <OptionsContainer>
            <RememberMe>
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label htmlFor="rememberMe">Keep me logged in</Label>
            </RememberMe>
            <ForgotPassword href="#">Forgot Password?</ForgotPassword>
          </OptionsContainer>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <SignUpText>
            Don't have an account?{" "}
            <SignUpLink href="#" onClick={handleSignUpClick}>
              Sign up
            </SignUpLink>
          </SignUpText>
        </FormContainer>
      </FormCard>

      {showPopup && (
        <PopupOverlay>
          <PopupContainer>
            <RestrictedIcon>
              <RiShieldKeyholeLine />
            </RestrictedIcon>
            <PopupTitle>Account Creation Restricted</PopupTitle>
            <PopupMessage>
              Apologies, but you do not have permission to create an account for
              the admin dashboard. Please contact the administrator for access.
            </PopupMessage>
            <PopupButton onClick={closePopup}>OK</PopupButton>
          </PopupContainer>
        </PopupOverlay>
      )}
    </LoginContainer>
  );
};

// Styled Components

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const PopupContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const RestrictedIcon = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const PopupTitle = styled.h3`
  color: #0f8abe;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
`;

const PopupMessage = styled.p`
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 1rem;
  animation: fadeIn 0.5s ease-out;
`;

const PopupButton = styled.button`
  background-color: #0f8abe;
  color: white;
  border: none;
  padding: 0.6rem 3rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: fadeIn 0.6s ease-out;

  &:hover {
    background-color: #0d7ba8;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem 1.5rem;
  background: #0f8abe;
`;

const Logo = styled.img`
  height: 80px;
  width: auto;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.h2`
  color: white;
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SubText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
`;

const FormContainer = styled.form`
  padding: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.25rem;
`;

const InputLabel = styled.label`
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.05rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0f8abe;
    box-shadow: 0 0 0 3px rgba(15, 138, 190, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: #64748b;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  border: 2px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background-color: #fff;

  &:hover {
    border-color: #0f8abe;
  }

  &:checked {
    background-color: #0f8abe;
    border-color: #0f8abe;
  }

  &:checked::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 5px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(15, 138, 190, 0.3);
  }
`;

const Label = styled.label`
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
`;

const ForgotPassword = styled.a`
  color: #0f8abe;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0d7ba8;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #0f8abe;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0d7ba8;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #e53e3e;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fff5f5;
  border-radius: 4px;
`;

const SignUpText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.95rem;
`;

const SignUpLink = styled.a`
  color: #0f8abe;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #0d7ba8;
  }
`;

export default LoginForm;
