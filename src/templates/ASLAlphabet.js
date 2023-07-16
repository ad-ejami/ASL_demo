import Navbar from "@components/Navbar";
import ObjCamara from "@components/ObjCamara";
import Camara from "@components/Camara";

const Alphabet = () => {
  return (
    <div>
      <Navbar />
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <h1>The alphabet sample</h1>
      </div>
      <Camara />
    </div>
  );
}

export default Alphabet;