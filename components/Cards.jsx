const handleDelete = async (id) => {
  if (onDelete) {
    onDelete(id);
  }
}; 

const ScriptureCard = ({ verse, verseLocation, query, onRefresh, onDelete, version, id }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const ref = useRef(null);
  
  // Split the passed verse and verseLocation strings by double newline.
  const verses = verse.split(/\n\s*\n/);
  const locations = verseLocation.split(/\n\s*\n/);
  
  // Merge the arrays (if mismatch, fallback to empty string for missing locations)
  const passages = verses.map((v, i) => ({
    verse: v.trim(),
    location: (locations[i] || '').trim()
  }));
  
  const handleCopy = () => {
    const textToCopy = passages
      .map(p => `${p.verse} - ${p.location}`)
      .join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    toast.success('Copied to clipboard!');
  };
  
  return (
    <Card className="relative bg-white dark:bg-navy-800/50 shadow-md" ref={ref}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-navy-800 dark:text-cream-50">
              {query}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="text-navy-600/60 hover:text-red-500 dark:text-cream-100/60 dark:hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-navy-700 dark:text-cream-100">
        {passages.map((p, index) => (
          <div key={index} className={`${index > 0 ? "mt-4 border-t pt-2" : ""}`}>
            <p className="text-base">{p.verse}</p>
            <span className="text-sm text-muted-foreground">{p.location}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}; 