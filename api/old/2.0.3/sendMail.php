<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
//use PHPMailer\PHPMailer;
//use PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';


// Load Composer's autoloader
//require 'vendor/autoload.php';
function sendmail($email_adress,$name_email_adress,$subject,$message){
// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);

    try {
        
        //Server settings
        $mail->SMTPDebug = 0;                                       // Enable verbose debug output
        $mail->isSMTP();  
        $mail->CharSet = 'UTF-8';                                           // Set mailer to use SMTP
        $mail->Host       = 'kompio.home.pl';  // Specify main and backup SMTP servers
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'crm@intertrend.pl';                     // SMTP nazwa_uzytkownika
        $mail->Password   = 'zozw5PJElb';                              // SMTP haslo
        $mail->SMTPSecure = false;                                  // Enable TLS encryption, `ssl` also accepted
        $mail->Port       = 587;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom('crm@intertrend.pl', 'webCRM');

        $mail->addAddress($email_adress, $name_email_adress);     // Add a recipient

        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $message;
        //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

function sendmailHelp($email_reply_to,$name_reply_to,$subject,$message){
    // Instantiation and passing `true` enables exceptions
    $mail = new PHPMailer(true);
    
        try {
            
            //Server settings
            $mail->SMTPDebug = 0;                                       // Enable verbose debug output
            $mail->isSMTP();       
            $mail->CharSet = 'UTF-8';                                     // Set mailer to use SMTP
            $mail->Host       = 'kompio.home.pl';  // Specify main and backup SMTP servers
            $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
            $mail->Username   = 'crm@intertrend.pl';                     // SMTP nazwa_uzytkownika
            $mail->Password   = 'zozw5PJElb';                               // SMTP haslo
            $mail->AddReplyTo ($email_reply_to,$name_reply_to);
            $mail->SMTPSecure = false;                                  // Enable TLS encryption, `ssl` also accepted
            $mail->Port       = 587;                                    // TCP port to connect to
    
            //Recipients
            $mail->setFrom('crm@intertrend.pl', 'webCRM');
    
            $mail->addAddress("a.grudzinski@intertrend.pl", "Arkadiusz Grudziński");     // Add a recipient
    
            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $message;
            //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    
            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }