<?php
final class Contact
{
    public private(set) string $email {
        set {
            $clean = trim($value);
            if (filter_var($clean, FILTER_VALIDATE_EMAIL) === false) {
                throw new InvalidArgumentException('Invalid email');
            }
            $this->email = strtolower($clean);
        }
    }
    public function __construct(string $email) { $this->email = $email; }
}
$contact = new Contact(' OMAR@EXAMPLE.COM ');
echo $contact->email, PHP_EOL;
