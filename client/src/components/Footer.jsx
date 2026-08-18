export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-5">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} FoodLink • Built to reduce food waste & fight hunger</p>
      </div>
    </footer>
  );
}
