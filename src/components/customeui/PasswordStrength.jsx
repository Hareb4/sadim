import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export function PasswordStrength({ password }) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      if (password?.length > 6) score += 20;
      if (password?.match(/[A-Z]/)) score += 20;
      if (password?.match(/[a-z]/)) score += 20;
      if (password?.match(/[0-9]/)) score += 20;
      if (password?.match(/[^A-Za-z0-9]/)) score += 20;
      setStrength(score);
    };

    calculateStrength();
  }, [password]);

  return (
    <div className="mt-2">
      <Progress
        value={strength}
        className={`w-full`}
      />
      <p className="text-sm mt-1">
        {strength < 40 && "ضعيف"}
        {strength >= 40 && strength < 80 && "متوسط"}
        {strength >= 80 && "قوي"}
      </p>
    </div>
  );
}
