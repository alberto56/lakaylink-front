<?php

/**
 * Reads CSV from stdin and runs every check in ./checks/ on each line.
 *
 * Each file in ./checks/ defines a function with the same name as the file,
 * which takes an associative array (column name => cell value) and returns
 * '' on success or an error string on failure.
 */

$checks = [];
foreach (glob(__DIR__ . '/checks/*.php') as $file) {
  require_once $file;
  $checks[] = basename($file, '.php');
}

$in = fopen('php://stdin', 'r');
$header = fgetcsv($in, null, ',', '"', '');
if ($header === FALSE) {
  fwrite(STDERR, "ERROR: the spreadsheet is empty\n");
  exit(1);
}
$header = array_map('trim', $header);

$errors = [];
// Line 1 is the header, so data starts on line 2, as in the spreadsheet.
$line_number = 1;
while (($cells = fgetcsv($in, null, ',', '"', '')) !== FALSE) {
  $line_number++;
  $row = [];
  foreach ($header as $i => $column) {
    $row[$column] = $cells[$i] ?? '';
  }
  foreach ($checks as $check) {
    $error = $check($row);
    if ($error !== '') {
      $errors[] = "Line $line_number: $check: $error";
    }
  }
}

foreach ($errors as $error) {
  echo "$error\n";
}

if ($errors) {
  exit(1);
}

echo "All checks passed for " . ($line_number - 1) . " lines.\n";
