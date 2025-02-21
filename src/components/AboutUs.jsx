import { Html } from "@react-three/drei";
import styles from "../styles/AboutUs.module.css";

export default function AboutUs() {
  return (
    <Html
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      transform
      distanceFactor={1}
    >
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <p className={styles.content}>
            We transform ground breaking concepts into compelling digital
            experiences. Focusing on dynamic brand creation, innovative 
            digital solutions, and captivating user interaction designs, 
            we collaborate with you to shape <span className={styles.the}>the future of your brand.</span>
          </p>
        </div>
      </div>
    </Html>
  );
}
