const fs = require('fs');

const files = [
  'src/components/forms/TimeInput.jsx',
  'src/components/forms/TextInput.jsx',
  'src/components/forms/TextareaInput.jsx',
  'src/components/forms/SelectInput.jsx',
  'src/components/forms/FileUploadInput.jsx',
  'src/components/forms/DateInput.jsx',
  'src/components/forms/Checkbox.jsx',
  'src/components/ui/PriorityBadge.jsx',
  'src/components/ui/NoShowRiskBadge.jsx',
  'src/components/ui/AppointmentStatusBadge.jsx',
  'src/components/display/DashboardStatCard.jsx',
  'src/components/display/NotificationCard.jsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // Match className={ ... } where ... does not contain quotes, backticks (\\x60), or braces
  content = content.replace(/className=\{([^"'\x60\}]+)\}/g, (match, inner) => {
    if (inner.includes('lex flex-col')) return 'className={\\x60flex flex-col gap-1.5 \\x60}';
    if (inner.includes('lex items-start')) return 'className={\\x60flex items-start gap-2 \\x60}';
    if (inner.includes('inline-flex items-center')) return 'className={\\x60inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border \\x60}';
    if (inner.includes('ext-xs font-medium')) return 'className={\\x60text-xs font-medium \\x60}';
    if (inner.includes('ext-sm font-semibold')) return 'className={\\x60text-sm font-semibold \\x60}';
    if (inner.includes('w-10 h-10')) return 'className={\\x60w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 \\x60}';
    return match;
  });

  // Convert the escaped backticks to real backticks
  content = content.replace(/\\x60/g, String.fromCharCode(96));

  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed', f);
});
