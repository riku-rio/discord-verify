from discord_verify_adapter import PACKAGE_NAME, __version__


def test_package_metadata() -> None:
    assert PACKAGE_NAME == "discord-verify-adapter-bridge"
    assert __version__ == "0.1.0"
