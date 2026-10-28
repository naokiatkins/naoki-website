import CreativePage from "@/components/CreativePage";

export default function MusicHome() {
  return (
    <CreativePage section="music" title="Music" intro="Songs and sounds I've made.">
      <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-24">
        <div className="rounded-2xl bg-sand/80 backdrop-blur-[2px] p-6 md:p-10 text-muted">
          Tracks coming soon.
        </div>
      </section>
    </CreativePage>
  );
}
