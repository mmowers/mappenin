<?php
/*
 * Implements  hook_views_default_views()
 */
function tinbully_glue_views_default_views() {
  $files = file_scan_directory(drupal_get_path('module', 'tinbully_glue'). '/views', '/\.view$/');
  foreach ($files as $filepath => $file) {
    $view = NULL;
    require $filepath;
    if (isset($view)) {
      $views[$view->name] = $view;
    }
  }
  return $views;
}