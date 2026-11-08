<?php
// Contact form handler for contact.html
// Sends the message to $to from your own server. Needs PHP mail() enabled (standard on cPanel).
// If messages land in spam, create the mailbox no-reply@p-man.com.ng in cPanel and check SPF/DKIM under Email Deliverability.

$to   = 'info@p-man.com.ng';
$from = 'no-reply@p-man.com.ng';   // must be an address on your own domain
$back = 'contact.html';

function clean($v, $max) {
    $v = trim((string)$v);
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);          // block header injection
    return mb_substr($v, 0, $max);
}
function finish($ok, $back, $json) {
    if ($json) {
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok]);
    } else {
        header('Location: ' . $back . ($ok ? '#sent' : '#error'));
    }
    exit;
}

$json = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . $back); exit; }

// Honeypot: real visitors leave this empty
if (!empty($_POST['website'])) { finish(true, $back, $json); }

$name    = clean($_POST['name']    ?? '', 100);
$email   = clean($_POST['email']   ?? '', 150);
$phone   = clean($_POST['phone']   ?? '', 40);
$service = clean($_POST['service'] ?? '', 80);
$message = trim((string)($_POST['message'] ?? ''));
$message = mb_substr(str_replace("\r", '', $message), 0, 4000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, $back, $json);
}

$subject = 'Website enquiry' . ($service !== '' ? ': ' . $service : '') . ' from ' . $name;
$body  = "Name: $name\nEmail: $email\nPhone: " . ($phone ?: '-') . "\nService: " . ($service ?: '-') . "\n\n$message\n";

$headers = [
    'From: PMIS Website <' . $from . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$ok = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
finish($ok, $back, $json);
