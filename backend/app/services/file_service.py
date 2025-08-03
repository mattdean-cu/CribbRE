from abc import ABC, abstractmethod
from typing import Optional, BinaryIO
import os
import shutil
from pathlib import Path
import uuid

from app.core.settings import settings


class FileService(ABC):
    """
    Abstract file service - works with any storage provider
    Local files, S3, DigitalOcean Spaces, etc.
    """

    @abstractmethod
    async def upload_file(self, file: BinaryIO, filename: str, folder: str = "") -> str:
        """Upload a file and return the file URL/path"""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete a file, return True if successful"""
        pass

    @abstractmethod
    def get_file_url(self, file_path: str) -> str:
        """Get the public URL for a file"""
        pass

    @abstractmethod
    async def file_exists(self, file_path: str) -> bool:
        """Check if a file exists"""
        pass


class LocalFileService(FileService):
    """
    Local file storage - perfect for development and simple deployments
    """

    def __init__(self):
        self.base_path = Path(settings.FILE_STORAGE_PATH)
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def upload_file(self, file: BinaryIO, filename: str, folder: str = "") -> str:
        """Upload file to local storage"""
        try:
            # Create unique filename to avoid conflicts
            file_id = str(uuid.uuid4())
            file_extension = Path(filename).suffix
            unique_filename = f"{file_id}{file_extension}"

            # Create folder path
            folder_path = self.base_path / folder
            folder_path.mkdir(parents=True, exist_ok=True)

            # Full file path
            file_path = folder_path / unique_filename

            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file, buffer)

            # Return relative path for storage in database
            relative_path = str(Path(folder) / unique_filename) if folder else unique_filename
            return relative_path

        except Exception as e:
            raise Exception(f"Failed to upload file: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from local storage"""
        try:
            full_path = self.base_path / file_path
            if full_path.exists():
                full_path.unlink()
                return True
            return False
        except Exception:
            return False

    def get_file_url(self, file_path: str) -> str:
        """Get URL for local file (served by FastAPI static files)"""
        return f"/static/uploads/{file_path}"

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists locally"""
        full_path = self.base_path / file_path
        return full_path.exists()


class S3FileService(FileService):
    """
    AWS S3 file storage - for when you migrate to AWS
    This will be implemented when you're ready for AWS
    """

    def __init__(self):
        # This will be implemented when migrating to AWS
        try:
            import boto3
            self.s3_client = boto3.client('s3')
            self.bucket_name = settings.AWS_S3_BUCKET
        except ImportError:
            raise Exception("boto3 not installed. Install with: pip install boto3")

    async def upload_file(self, file: BinaryIO, filename: str, folder: str = "") -> str:
        """Upload file to S3"""
        # TODO: Implement when migrating to AWS
        raise NotImplementedError("S3 upload will be implemented during AWS migration")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3"""
        # TODO: Implement when migrating to AWS
        raise NotImplementedError("S3 delete will be implemented during AWS migration")

    def get_file_url(self, file_path: str) -> str:
        """Get S3 file URL"""
        # TODO: Implement when migrating to AWS
        return f"https://{self.bucket_name}.s3.amazonaws.com/{file_path}"

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in S3"""
        # TODO: Implement when migrating to AWS
        raise NotImplementedError("S3 file_exists will be implemented during AWS migration")


def get_file_service() -> FileService:
    """
    Factory function to get the appropriate file service
    Change storage provider by changing environment variable!
    """
    storage_type = settings.FILE_STORAGE_TYPE.lower()

    if storage_type == "s3":
        return S3FileService()
    elif storage_type == "local":
        return LocalFileService()
    else:
        # Default to local storage
        return LocalFileService()


# Global file service instance
file_service = get_file_service()