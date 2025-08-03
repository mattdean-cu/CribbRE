from abc import ABC, abstractmethod
from typing import List, Optional
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.settings import settings

logger = logging.getLogger(__name__)


class EmailService(ABC):
    """
    Abstract email service - works with any email provider
    Console, SMTP, SendGrid, AWS SES, etc.
    """

    @abstractmethod
    async def send_email(
            self,
            to_email: str,
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send an email"""
        pass

    @abstractmethod
    async def send_bulk_email(
            self,
            to_emails: List[str],
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send email to multiple recipients"""
        pass


class ConsoleEmailService(EmailService):
    """
    Console email service - perfect for development
    Prints emails to console instead of sending them
    """

    async def send_email(
            self,
            to_email: str,
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Print email to console"""
        print("\n" + "=" * 50)
        print("📧 EMAIL (Console)")
        print("=" * 50)
        print(f"To: {to_email}")
        print(f"From: {settings.EMAIL_FROM}")
        print(f"Subject: {subject}")
        print("-" * 30)
        print("HTML Content:")
        print(html_content)
        if text_content:
            print("-" * 30)
            print("Text Content:")
            print(text_content)
        print("=" * 50 + "\n")
        return True

    async def send_bulk_email(
            self,
            to_emails: List[str],
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Print bulk email to console"""
        for email in to_emails:
            await self.send_email(email, subject, html_content, text_content)
        return True


class SMTPEmailService(EmailService):
    """
    SMTP email service - works with Gmail, Outlook, etc.
    """

    async def send_email(
            self,
            to_email: str,
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send email via SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = settings.EMAIL_FROM
            msg['To'] = to_email

            # Add text and HTML parts
            if text_content:
                part1 = MIMEText(text_content, 'plain')
                msg.attach(part1)

            part2 = MIMEText(html_content, 'html')
            msg.attach(part2)

            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_bulk_email(
            self,
            to_emails: List[str],
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send bulk email via SMTP"""
        success_count = 0
        for email in to_emails:
            if await self.send_email(email, subject, html_content, text_content):
                success_count += 1

        return success_count == len(to_emails)


class SendGridEmailService(EmailService):
    """
    SendGrid email service - recommended for production
    """

    def __init__(self):
        try:
            import sendgrid
            from sendgrid.helpers.mail import Mail
            self.sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
            self.Mail = Mail
        except ImportError:
            raise Exception("sendgrid not installed. Install with: pip install sendgrid")

    async def send_email(
            self,
            to_email: str,
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send email via SendGrid"""
        try:
            message = self.Mail(
                from_email=settings.EMAIL_FROM,
                to_emails=to_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=text_content
            )

            response = self.sg.send(message)

            if response.status_code == 202:
                logger.info(f"Email sent successfully to {to_email}")
                return True
            else:
                logger.error(f"SendGrid returned status {response.status_code}")
                return False

        except Exception as e:
            logger.error(f"Failed to send email via SendGrid to {to_email}: {str(e)}")
            return False

    async def send_bulk_email(
            self,
            to_emails: List[str],
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send bulk email via SendGrid"""
        try:
            message = self.Mail(
                from_email=settings.EMAIL_FROM,
                to_emails=to_emails,  # SendGrid handles bulk
                subject=subject,
                html_content=html_content,
                plain_text_content=text_content
            )

            response = self.sg.send(message)
            return response.status_code == 202

        except Exception as e:
            logger.error(f"Failed to send bulk email via SendGrid: {str(e)}")
            return False


class SESEmailService(EmailService):
    """
    AWS SES email service - for when you migrate to AWS
    """

    def __init__(self):
        try:
            import boto3
            self.ses_client = boto3.client('ses', region_name=settings.AWS_REGION)
        except ImportError:
            raise Exception("boto3 not installed. Install with: pip install boto3")

    async def send_email(
            self,
            to_email: str,
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send email via AWS SES"""
        # TODO: Implement when migrating to AWS
        raise NotImplementedError("SES will be implemented during AWS migration")

    async def send_bulk_email(
            self,
            to_emails: List[str],
            subject: str,
            html_content: str,
            text_content: Optional[str] = None
    ) -> bool:
        """Send bulk email via AWS SES"""
        # TODO: Implement when migrating to AWS
        raise NotImplementedError("SES bulk email will be implemented during AWS migration")


def get_email_service() -> EmailService:
    """
    Factory function to get the appropriate email service
    Change email provider by changing environment variable!
    """
    backend_type = settings.EMAIL_BACKEND.lower()

    if backend_type == "sendgrid":
        return SendGridEmailService()
    elif backend_type == "smtp":
        return SMTPEmailService()
    elif backend_type == "ses":
        return SESEmailService()
    else:
        # Default to console for development
        return ConsoleEmailService()


# Global email service instance
email_service = get_email_service()