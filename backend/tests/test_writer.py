from core.azure_writer import AzureWriter
from pathlib import Path
from support.vars import DEFAULT_OPCO_MAP
from support.types import Response
import support.utils as utils

names: list[str] = ["John Doe", "Jane Doe"]
usernames: list[str] = utils.generate_usernames(names, ["" for _ in range(len(names))], DEFAULT_OPCO_MAP)
passwords: list[str] = [utils.generate_password(20) for _ in range(len(names))]

text: str = "Hello [USERNAME] I am [NAME] and your password is [PASSWORD]"

def test_write_csv(tmp_path: Path):
    writer: AzureWriter = AzureWriter()

    writer.set_full_names(names)
    writer.set_usernames(usernames)
    writer.set_passwords(passwords)

    res: Response = writer.write_template(tmp_path, text=text)

    if res["status"] == "error":
        raise AssertionError(f"Failed to validate CSV")
    
    output_dir: Path = Path(res["output_dir"])

    for i, file in enumerate(sorted(output_dir.iterdir())):
        with open(file, "r") as file:
            content: str = file.read()

        name: str = names[i]
        username: str = usernames[i]
        password: str = passwords[i]

        if name not in content and username not in content \
            and password not in content:
            raise AssertionError(
                f"Failed to write text with data: {content}, got {name} | {username} | {password}"
            )

def test_fail_write_csv_no_names(tmp_path: Path):
    writer: AzureWriter = AzureWriter()

    writer.set_full_names(names)
    writer.set_passwords(passwords)

    res: Response = writer.write_template(tmp_path, text=text)

    assert res["status"] == "error"

def test_fail_write_csv_no_usernames(tmp_path: Path):
    writer: AzureWriter = AzureWriter()

    writer.set_usernames(usernames)
    writer.set_passwords(passwords)

    res: Response = writer.write_template(tmp_path, text=text)

    assert res["status"] == "error"

def test_fail_write_csv_no_passwords(tmp_path: Path):
    writer: AzureWriter = AzureWriter()

    writer.set_full_names(names)
    writer.set_usernames(usernames)

    res: Response = writer.write_template(tmp_path, text=text)

    assert res["status"] == "error"