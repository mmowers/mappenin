<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 * 
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */

// MRM I'm using it without deleting the line
function subomega_preprocess_html(&$variables,$hook) {
  //MRM copying from dgd7 page 344 to add conditional stylesheet for frontmap
  $path = drupal_get_destination();
  $path_cur = current_path();
  $request_path = request_path();
  $path_components = explode('/', $path_cur);
  if($variables['is_front']){
    drupal_add_css(path_to_theme() . '/css/MMextra-front.css', array('weight' => CSS_THEME));
    drupal_add_js(path_to_theme() . '/js/MMextra-front.js'
      ,array('type' => 'file', 'scope' => 'footer', 'weight' => 100, 'group' => JS_THEME));
    drupal_add_js("http://maps.google.com/maps/api/js?sensor=false");
    drupal_add_js("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobubble/src/infobubble.js");
  }
//  elseif($path['destination']=='node/add/event' || ($path_components[0]=='node' && $path_components[2]=='edit')){
  elseif($path_cur =='node/add/event' || ($path_components[0]=='node' && $path_components[2]=='edit')){
    drupal_add_css(path_to_theme() . '/css/MMextra-node-add.css', array('weight' => CSS_THEME));
    drupal_add_js(path_to_theme() . '/js/MMextra-node-add.js'
      ,array('type' => 'file', 'scope' => 'footer', 'weight' => 100, 'group' => JS_THEME));
    drupal_add_js("http://maps.google.com/maps/api/js?sensor=false");
    drupal_add_js("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobubble/src/infobubble.js");
  }
  elseif($path_cur =='favorite-venues' || $path_cur =='favorite-venues/schedule' ||
         $path_cur =='friends' || $path_cur =='friends/schedule' ||
         ($path_components[0]=='venue' && ($path_components[2]==NULL || $path_components[2]=='schedule')) ||
          $path_cur =='my-events'){
    drupal_add_js(path_to_theme() . '/js/MMextra-ven-schedule.js'
      ,array('type' => 'file', 'scope' => 'footer', 'weight' => 100, 'group' => JS_THEME));
  }
  
  // The body tag's classes are controlled by the $classes_array variable. To
  // remove a class from $classes_array, use array_diff().
  //$variables['classes_array'] = array_diff($variables['classes_array'], array('class-to-remove'));
}

/*
function subomega_preprocess_node(&$variables,$hook) {
  $testvar = 1;
}
*/
function subomega_process_node(&$variables,$hook) {
  $profile = profile2_load_by_user($variables['uid']);
  if(!empty($profile['venue']->field_ven_name['und'][0]['safe_value'])){
    $variables['name']= l($profile['venue']->field_ven_name['und'][0]['safe_value'], 'venue/'.$variables['uid']);        
  }
  else{
    $variables['name']= '';        
    //$variables['name']= l(t('(No name)'), 'venue/'.$variables['uid']);        
  }
}
/**
 * Theme the username title of the user login form
 * and the user login block. copied mostly from logintoboggan theme_lt_username_title.
 */
function subomega_lt_username_title($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // Label text for the username field on the /user/login page.
      return t('Email or Name');
      break;

    case 'user_login_block':
      // Label text for the username field when shown in a block.
      return t('Email or Name');
      break;
  }
}

/**
 * Implement hook_form_user_register_form_alter().
 * 
 * Idea to use this was from logintoboggan_form_user_register_form_alter. For some
 * reason it seems my custom module doesn't see this as a form???
 */
function subomega_form_user_register_form_alter(&$form, &$form_state) {
  $form['account']['name']['#title'] = t('Full Name');
  $form['account']['name']['#description'] = t('Your name as you and others will see it.');
  $form['account']['mail']['#description'] = t('A valid Stanford e-mail address.');
  $form['#validate'][] = 'user_register_stanford_validate';
}

function user_register_stanford_validate($form, &$form_state){
  $email_array = explode('@',$form_state['values']['mail']);
  if(drupal_strtolower($email_array[1]) != 'stanford.edu'){
//  if(drupal_strtolower($email_array[1]) != 'stanford.edu' && drupal_strtolower($email_array[1]) != 'stanfordalumni.org'){
    form_set_error('mail', t('You must enter a valid Stanford email address.'));
    return;
  }
}
