import Navbar from "@components/Navbar";
import styles from '@styles/HomePage.module.css';

const HomePage = () => {

  return(
    <div>
      <Navbar />
      <h1 className={styles.pageTitle}>Welcome to ASL project</h1>
      <p className={styles.pageSubtitle}>Here you can learn and check your skill in ASL alphabet.</p>
      <p className={styles.pageNote}>Develop by Bryan Jami</p>
    </div>
  );
}

export default HomePage;