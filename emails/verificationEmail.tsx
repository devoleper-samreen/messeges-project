import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  otp: string | number;
  username: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  otp,
  username,
}) => (
  <Html>
    <Head />
    <Preview>Your OTP Code</Preview>
    <Body
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f6f9fc",
        padding: "20px",
      }}
    >
      <Container
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Section>
          <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
            OTP Verification
          </Text>
        </Section>

        <Section>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            Hi {username}, 👋
          </Text>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            Use the following OTP to complete your verification. This OTP is
            valid for 10 minutes.
          </Text>
        </Section>

        <Section style={{ textAlign: "center", margin: "20px 0" }}>
          <Text
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              letterSpacing: "4px",
              color: "#1a73e8",
              backgroundColor: "#e8f0fe",
              padding: "10px 0",
              borderRadius: "6px",
            }}
          >
            {otp}
          </Text>
        </Section>

        <Section>
          <Text style={{ fontSize: "14px", color: "#888" }}>
            If you didn't request this code, you can safely ignore this email.
          </Text>
        </Section>

        <Section>
          <Button
            style={{
              backgroundColor: "#1a73e8",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
            }}
            href="#"
          >
            Verify Now
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;
