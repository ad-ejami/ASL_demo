import Navbar from "@components/Navbar";
import Link from "next/link";
import styles from '@styles/Learning.module.css';

const Learning = () => {
  return (
    <dev>
      <Navbar />
      <div className={styles.learningBody}>
        <h1 className={styles.learningTitle}>Learn about American Sign Language Alphabet</h1>
        <p className={styles.learningInfo}>It is recommended to start learning the alphabet to start learning ASL.
        This webpage will help you to start your journal in this language.
        The Page will use a webcam to recognize your hand and help you with 
        the pose to make a good hand gesture according to the letter.</p>
        <button className={styles.learningButton}>
          <Link href="/alphabet">Start</Link>
        </button>
      </div>
    </dev>
  );
}

export default Learning;