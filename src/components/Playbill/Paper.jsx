import { css } from "@generated/css";

export const Paper = ({ children }) => (
  <div
    className={css({
      color: "#000",
      containerType: "inline-size",
      width: "80%",
      maxWidth: "800px",
      aspectRatio: "1 / 1.5",
      margin: "2rem auto",
      bg: "#e8dcc8",
      borderRadius: "3px 5px 4px 6px",
      backgroundImage: `
                linear-gradient(to right, rgba(75,35,8,0.45) 0%, transparent 2%),
                linear-gradient(to left, rgba(72,33,7,0.42) 0%, transparent 2%),
                linear-gradient(to bottom, rgba(78,36,9,0.40) 0%, transparent 2%),
                linear-gradient(to top, rgba(70,32,6,0.48) 0%, transparent 2%),
                radial-gradient(ellipse 40% 60% at 0% 0%, rgba(95,45,15,0.35) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 100% 0%, rgba(90,42,12,0.32) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 0% 100%, rgba(85,40,10,0.38) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 100% 100%, rgba(88,43,13,0.36) 0%, transparent 50%),
                radial-gradient(ellipse 25% 100% at 0% 50%, rgba(82,38,8,0.28) 0%, transparent 60%),
                radial-gradient(ellipse 25% 100% at 100% 50%, rgba(86,41,11,0.30) 0%, transparent 60%),
                radial-gradient(ellipse 100% 30% at 50% 0%, rgba(92,44,14,0.25) 0%, transparent 55%),
                radial-gradient(ellipse 100% 30% at 50% 100%, rgba(84,39,9,0.33) 0%, transparent 55%),
                radial-gradient(circle at 15% 20%, rgba(120,65,25,0.12) 0%, transparent 8%),
                radial-gradient(circle at 85% 15%, rgba(115,60,20,0.10) 0%, transparent 10%),
                radial-gradient(circle at 92% 80%, rgba(125,70,28,0.14) 0%, transparent 12%),
                radial-gradient(circle at 8% 85%, rgba(110,58,22,0.11) 0%, transparent 9%),
                radial-gradient(circle at 50% 95%, rgba(118,62,24,0.08) 0%, transparent 15%),
                radial-gradient(ellipse at 95% 5%, rgba(105,50,15,0.18) 0%, transparent 6%),
                radial-gradient(ellipse at 5% 8%, rgba(100,48,12,0.15) 0%, transparent 7%),
                linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%, rgba(115,60,20,0.05) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(110,55,18,0.025) 2px, rgba(110,55,18,0.025) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(108,52,16,0.02) 2px, rgba(108,52,16,0.02) 4px)
            `,
      boxShadow: `
                inset 0 0 60px rgba(101,67,33,0.08),
                inset 20px 0 40px rgba(101,67,33,0.06),
                inset -20px 0 40px rgba(101,67,33,0.06),
                inset 0 20px 40px rgba(101,67,33,0.06),
                inset 0 -20px 40px rgba(101,67,33,0.05),
                0 4px 12px rgba(0,0,0,0.1),
                0 2px 4px rgba(0,0,0,0.06)
            `,
      transform: "rotate(1deg)",
    })}
  >
    {children}
  </div>
);
