<?php
// EUDR booking handler for eudr.html
// 1. Validates the form, creates a booking reference.
// 2. Emails the booking to the company and a confirmation to the customer.
// 3. Sends the visitor to eudr-thanks.html, where they pay through Payaza.
// Matching payments to bookings is manual (by reference/email) until a Payaza webhook is added.

$to   = 'info@p-man.com.ng';
$from = 'no-reply@p-man.com.ng';   // must be a mailbox on your own domain
$ok_page = 'eudr-thanks.html';
$err_page = 'eudr.html#error';

function clean($v, $max) {
    $v = trim((string)$v);
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);   // block header injection
    return mb_substr($v, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: eudr.html'); exit; }
if (!empty($_POST['website'])) { header('Location: ' . $ok_page); exit; }   // honeypot

$package = ($_POST['package'] ?? '') === 'audit' ? 'audit' : 'training';
$label   = $package === 'audit' ? 'EUDR Readiness Audit' : 'EUDR Compliance Training';
$org     = clean($_POST['org'] ?? '', 120);
$name    = clean($_POST['name'] ?? '', 100);
$email   = clean($_POST['email'] ?? '', 150);
$phone   = clean($_POST['phone'] ?? '', 40);
$people  = (int)($_POST['participants'] ?? 0);
$where   = clean($_POST['location'] ?? '', 120);
$venue   = clean($_POST['venue'] ?? '', 40);
$notes   = mb_substr(str_replace("\r", '', trim((string)($_POST['notes'] ?? ''))), 0, 2000);

if ($org === '' || $name === '' || $phone === '' || $where === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $err_page); exit;
}

$ref = 'PMIS-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));

$body = "New EUDR booking (payment pending)\nReference: $ref\nPackage: $label\n\n"
      . "Organisation: $org\nContact: $name\nEmail: $email\nPhone: $phone\n"
      . "Participants: " . ($people > 0 ? $people : '-') . "\nBased in: $where\nVenue preference: $venue\n\nNotes:\n" . ($notes ?: '-') . "\n";

$enc = function ($s) { return '=?UTF-8?B?' . base64_encode($s) . '?='; };
$h1 = implode("\r\n", ['From: PMIS Website <' . $from . '>', 'Reply-To: ' . $name . ' <' . $email . '>', 'Content-Type: text/plain; charset=UTF-8']);
$sent = mail($to, $enc("EUDR booking $ref: $label ($org)"), $body, $h1);

// Confirmation to the customer
$cbody = "Hello $name,\n\nThank you for booking $label with PMIS NIG. LTD.\nYour booking reference is $ref.\n\n"
       . "Please complete your payment online to confirm the booking. After payment we will contact you to agree the date and venue.\n\n"
       . "Questions? Call +234 (0) 8158506528 or reply to this email.\n\nPMIS NIG. LTD\n";
$h2 = implode("\r\n", ['From: PMIS NIG. LTD <' . $from . '>', 'Reply-To: ' . $to, 'Content-Type: text/plain; charset=UTF-8']);
mail($email, $enc("Your EUDR booking $ref"), $cbody, $h2);

if (!$sent) { header('Location: ' . $err_page); exit; }
header('Location: ' . $ok_page . '?ref=' . urlencode($ref) . '&pkg=' . $package);
