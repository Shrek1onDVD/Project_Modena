<?php
// Voorkom directe toegang
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// CORS headers voor jouw domein (pas aan als nodig)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Vervang * door je domein in productie
header('Access-Control-Allow-Methods: POST');

// Ontvang en valideer data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$honeypot = isset($_POST['company']) ? trim($_POST['company']) : '';

// Honeypot check (spam filter)
if (!empty($honeypot)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
    exit;
}

// Validatie
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vul alle velden in.']);
    exit;
}

// E-mail validatie
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vul een geldig e-mailadres in.']);
    exit;
}

// Bericht lengte check
if (strlen($name) > 100 || strlen($email) > 100 || strlen($message) > 2000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bericht is te lang.']);
    exit;
}

// E-mail instellingen
$to = 'info@dhain.nl'; // Jouw e-mailadres
$subject = 'Kennismaking via DHAIN website - ' . htmlspecialchars($name);

// E-mail body
$email_body = "Nieuwe kennismakingsaanvraag via DHAIN.nl\n\n";
$email_body .= "Naam: " . htmlspecialchars($name) . "\n";
$email_body .= "E-mail: " . htmlspecialchars($email) . "\n\n";
$email_body .= "Bericht:\n" . htmlspecialchars($message) . "\n\n";
$email_body .= "---\n";
$email_body .= "Verzonden op: " . date('d-m-Y H:i:s') . "\n";
$email_body .= "IP-adres: " . $_SERVER['REMOTE_ADDR'] . "\n";

// E-mail headers
$headers = "From: noreply@dhain.nl\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Verstuur e-mail
if (mail($to, $subject, $email_body, $headers)) {
    echo json_encode([
        'success' => true, 
        'message' => 'Bericht succesvol verzonden! We nemen zo snel mogelijk contact met je op.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Er ging iets mis bij het verzenden. Probeer het opnieuw of mail direct naar info@dhain.nl.'
    ]);
}
?>
