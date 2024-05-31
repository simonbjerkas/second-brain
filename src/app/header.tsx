import { HeaderActions } from './header-actions';

export const Header = () => {
  return (
    <header className="bg-secondary py-4 mb-8">
      <nav className="container mx-auto flex justify-between items-center">
        <section>SecondBrain</section>
        <section className="flex items-center gap-8">
          <HeaderActions />
        </section>
      </nav>
    </header>
  );
};
