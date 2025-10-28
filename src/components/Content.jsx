import './Content.css';

function Content({ section }) {
  if (!section) return null;

  return (
    <div className="content">
      <h1 className="content-title">{section.title}</h1>
      <div className="content-body">
        {section.content}
      </div>
    </div>
  );
}

export default Content;

