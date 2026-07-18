from discord_verify_bridge import BRIDGE_PROTOCOL_VERSION


def test_bridge_protocol_version_is_defined() -> None:
    assert BRIDGE_PROTOCOL_VERSION == "0.0.0"
