import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function InputOTPDisabled() {
  return (
    <InputOTP length={6} disabled defaultValue="123456">
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  );
}
