export const EXAMPLE_PROMPTS = [
  {
    title: "E-commerce Website",
    text: "Create a modern e-commerce website for handmade jewelry with navbar, hero section, product cards, search bar and shopping cart.",
  },
  {
    title: "Student Portfolio",
    text: "Create a portfolio website for a CSE student with About, Skills, Projects, Education and Contact sections.",
  },
  {
    title: "Restaurant Website",
    text: "Create a modern restaurant website with menu cards, reservation section and contact information.",
  },
  {
    title: "College Event",
    text: "Create a college technical event website with event details, speakers, schedule and registration button.",
  },
];

export default function ExamplePrompts({ onSelect, disabled }) {
  return (
    <div className="example-prompts">
      <span className="example-prompts-label">Try an example:</span>
      <div className="example-prompts-grid">
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example.title}
            className="example-card"
            onClick={() => onSelect(example.text)}
            disabled={disabled}
            type="button"
          >
            {example.title}
          </button>
        ))}
      </div>
    </div>
  );
}
