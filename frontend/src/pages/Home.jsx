import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-pink-100 via-orange-100 to-yellow-50 flex flex-col justify-center gap-12">

      {/* Welcome Section */}
      <motion.section 
        className="p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl transform hover:scale-105 transition duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">

          <Link 
            to="/scan" 
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 text-center"
          >
            Scan QR
          </Link>
          <Link 
            to="/admin" 
            className="px-8 py-4 border-2 border-orange-400 text-orange-500 hover:bg-orange-400 hover:text-white rounded-2xl font-bold shadow-md hover:scale-105 transition-transform duration-300 text-center"
          >
            Admin Dashboard
          </Link>
        </div>
      </motion.section>

     

    </div>
  );
}
