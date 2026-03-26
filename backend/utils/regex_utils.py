import re

# Regex patterns for sensitive data
PATTERNS = {
    "email": re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"),
    "password": re.compile(r"(?i)(?:password|passwd|pwd)\s*[=:]\s*['\"]?([^'\"\s]+)['\"]?"),
    "api_key": re.compile(r"(?i)(?:api_key|apikey|secret|sk-|key)\s*[=:]\s*['\"]?([^'\"\s]+)['\"]?|sk-[a-zA-Z0-9]{20,}"),
    "jwt": re.compile(r"eyJ[a-zA-Z0-9_=]+(?:\.eyJ[a-zA-Z0-9_=]+)+\.[a-zA-Z0-9_\-\+/\=]*"),
    "ip_address": re.compile(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b")
}

RISK_LEVELS = {
    "email": "low",
    "ip_address": "low",
    "jwt": "high",
    "api_key": "critical",
    "password": "critical"
}

def analyze_line(line: str, line_number: int):
    findings = []
    for data_type, pattern in PATTERNS.items():
        matches = pattern.finditer(line)
        for match in matches:
            # If the pattern has groups, prefer the first captured group (e.g., the actual password/key)
            # fallback to the whole match if no group matched or no groups exist
            groups = match.groups()
            value = groups[0] if groups and groups[0] else match.group(0)
            
            if not value:
                value = "***"
                
            findings.append({
                "type": data_type,
                "value": value,
                "line_number": line_number,
                "risk_level": RISK_LEVELS.get(data_type, "medium")
            })
    return findings
