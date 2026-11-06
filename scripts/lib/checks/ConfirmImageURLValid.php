<?php

/**
 * Makes sure image_url is a complete URL to a file with a lowercase name.
 *
 * Letters, numbers, dashes and underscores are allowed, with an optional
 * extension, for example https://example.com/media/products/farine-bongu_2.jpeg
 * or https://via.placeholder.com/300.
 */
function ConfirmImageURLValid(array $row): array {
  foreach (['image_1', 'image_2', 'image_3'] as $key) {
    if (!array_key_exists('image_url', $row)) {
      return 'there is no image_url column';
    }

    $url = trim($row['image_url']);
    if ($url === '') {
      return 'image_url is empty';
    }

    if (!filter_var($url, FILTER_VALIDATE_URL) || !preg_match('#^https?://#', $url)) {
      return "image_url $url is not a complete URL";
    }

    $file = basename(parse_url($url, PHP_URL_PATH) ?? '');
    if (!preg_match('/^[a-z0-9_-]+(\.[a-z0-9]+)?$/', $file)) {
      return "image_url $url: the file name $file must be all lowercase, with only letters, numbers, dashes and underscores";
    }
  }
  return '';
}
