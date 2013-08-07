<?php
// $Id: FeedsSelfNodeProcessor.inc,v 1.1.2.3 2011/02/01 11:00:03 twistor Exp $

/**
 * @file
 * Class definition of FeedsSelfNodeProcessor.
 */

/**
 * Allows a feed node to populate fields on itself.
 */
class FeedsSelfNodeProcessor extends FeedsNodeProcessor {

  /**
   * Process the result of the parsing stage.
   *
   * @param FeedsSource $source
   *   Source information about this import.
   * @param FeedsParserResult $parser_result
   *   The result of the parsing stage.
   */
  public function process(FeedsSource $source, FeedsParserResult $parser_result) {
    $item = $parser_result->shiftItem();

    // Only proceed if item has actually changed.
    $hash = $this->hash($item);
    if ($hash == $this->getHash($source->feed_nid)) {
      return;
    }
    $node = node_load($source->feed_nid, NULL, TRUE);
    $node->log = 'Updated by FeedsSelfNodeProcessor';
    $node->changed = REQUEST_TIME;
    $node->format = $this->config['input_format'];

    try {
      $this->map($source, $parser_result, $node);
      node_object_prepare($node);

      if (!isset($node->feeds)) {
        $node->feeds = array();
      }
      node_save($node);
    }
    catch (Exception $e) {
      drupal_set_message($e->getMessage(), 'warning');
      $message = $e->getMessage();
      $message .= '<h3>Original item</h3>';
      $message .= '<pre>' . var_export($item, TRUE) . '</pre>';
      $message .= '<h3>Entity</h3>';
      $message .= '<pre>' . var_export($node, TRUE) . '</pre>';
      $source->log('import', $message, array(), WATCHDOG_ERROR);
      return;
    }
    $message = t('@type %title has been updated.', array('@type' => node_type_get_name($node), '%title' => $node->title));
    drupal_set_message($message);
    $source->log('import', $message, array(), WATCHDOG_INFO);
  }

  /**
   * Override parent::configDefaults().
   */
  public function configDefaults() {
    $defaults = parent::configDefaults();
    $defaults['update_existing'] = FEEDS_UPDATE_EXISTING;
    $defaults['expire'] = FEEDS_EXPIRE_NEVER;
    return $defaults;
  }

  /**
   * Override parent::configForm().
   */
  public function configForm(&$form_state) {
    $form = parent::configForm($form_state);
    $form['expire']['#type'] = 'hidden';
    unset($form['update_existing']);
    unset($form['content_type']);
    $form['author']['#type'] = 'hidden';
    return $form;
  }

  /**
   * Return available mapping targets.
   */
  public function getMappingTargets() {
    $this->config['content_type'] = feeds_importer($this->id)->config['content_type'];
    if (empty($this->config['content_type'])) {
      drupal_set_message(t('This importer must be attached to a content type for Feeds Self Node Processor to work.'), 'warning');
      return array('' => array());
    }
    else {
      return parent::getMappingTargets();
    }
  }
}
