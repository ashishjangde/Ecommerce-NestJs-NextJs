import { ScrollArea } from "@/components/ui/scroll-area";
import HomeCrousal from "./_components/base/HomeCrousal";
import CategoryCrousal from "./_components/base/CategoryCrousal";
export default function Home() {
  return (
    <div className="flex items-center justify-center ">
     {/* Crousal */}
     <div className="w-screen">
        <HomeCrousal />
        <div className="flex flex-col items-center justify-center">
          <p className="text-center mt-16 text-lg text-neutral-700">Choose From Our Handpicked Categories</p>
        <CategoryCrousal /> 
        </div>
     </div>
    
    </div>
  );
}
