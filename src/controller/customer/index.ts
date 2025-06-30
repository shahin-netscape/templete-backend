import { Request, Response, Router } from "express";
import { handleForgotPassword, handleOtpVerification, handleResendOtp, handleResetPassword, handleUserLogin, handleUserSignup } from "../../services/common";
import { makeResponse } from "../../lib/common";


const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const newUser = await handleUserSignup(req.body);

    return makeResponse(res, 201, true, "User signed up successfully", {
      data: newUser,
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    return makeResponse(res, error.code || 500, false, error.message || "Something went wrong", error.data);
  }
  })


  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { token } = await handleUserLogin(req.body);
  
      return makeResponse(res, 200, true, "Login successful",{
        token
      });
  
    } catch (error: any) {
      console.error("Login error:", error);
  
      return makeResponse(
        res,
        error.code || 500,
        false,
        error.message || "Something went wrong",
        error.data
      );
    }
  });
  

router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
   await handleOtpVerification(req.body)

    return makeResponse(res, 200, true, "OTP verified successfully");

  } catch (error: any) {
    console.error("OTP verification error:", error);

      return makeResponse(res, error.code || 500, false, error.message || "Something went wrong", error.data);
  }
});

router.post('/resend-otp', async(req: Request, res: Response) => {
  try{
    await handleResendOtp(req.body)
    return makeResponse(res, 200, true, "OTP resend Successfully");
  }
  catch(error: any){
    return makeResponse(res, error.code || 500, false, error.message || "Something went wrong", error.data);
  }
});

router.post('/forgot', async (req: Request, res: Response) => {
  try {
    await handleForgotPassword(req.body);
    return makeResponse(res, 200, true, "OTP sent to email");
  } catch (error: any) {
    return makeResponse(res, error.code || 500, false, error.message || "Something went wrong");
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    await handleResetPassword(req.body);
    return makeResponse(res, 200, true, "Password reset successfully");
  } catch (error: any) {
    return makeResponse(res, error.code || 500, false, error.message || "Something went wrong");
  }
});

export const customerController = router;































