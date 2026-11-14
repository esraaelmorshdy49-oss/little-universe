import {motion,useReducedMotion} from 'framer-motion';
export default function Reveal({children,delay=0,className}){
  const r=useReducedMotion();
  return <motion.div className={className} initial={r?false:{opacity:0,y:28,filter:'blur(8px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,margin:'-60px'}} transition={{duration:.8,delay}}>{children}</motion.div>;
}
