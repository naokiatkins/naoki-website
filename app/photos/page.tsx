import Image from "next/image";
import CreativePage from "@/components/CreativePage";

export default function PhotosHome() {
  return (
    <CreativePage section="photos" title="Photography" intro="Moments I've caught with a camera.">
      <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-24">
        <figure>
          <Image
            src="/photos/cafe-window.webp"
            alt="Two people seen from behind at a dim café window, looking out at an ornately painted old town hall with a clock gable across a square"
            width={1228}
            height={1818}
            // Portrait: capped width so it doesn't fill several screens
            sizes="(min-width: 640px) 576px, 100vw"
            preload
            className="w-full max-w-xl h-auto rounded-2xl"
          />
        </figure>
      </section>
    </CreativePage>
  );
}
