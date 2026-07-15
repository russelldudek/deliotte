"""Provider-neutral deployment posture reference implementation."""
from dataclasses import dataclass
from enum import Enum

class Posture(str, Enum):
    ASSIST = "Assist inside the workflow"
    RECOMMEND = "Recommend, human decides"
    APPROVAL = "Execute with approval"
    AUTONOMOUS = "Bounded autonomous execution"
    HOLD = "Hold for redesign"

@dataclass(frozen=True)
class Scenario:
    consequence: int
    variability: int
    latency_pressure: int
    requested_autonomy: int

@dataclass(frozen=True)
class Recommendation:
    posture: Posture
    human_authority: str
    evaluation: str
    observability: str
    release_condition: str

def recommend(s: Scenario) -> Recommendation:
    values = (s.consequence, s.variability, s.latency_pressure, s.requested_autonomy)
    if any(not 1 <= value <= 5 for value in values):
        raise ValueError("All scenario values must be between 1 and 5.")
    risk = s.consequence * 1.45 + s.variability * 0.9 + s.requested_autonomy * 0.8 + s.latency_pressure * 0.35
    if s.consequence >= 5 or risk >= 14.2:
        return Recommendation(Posture.HOLD, "Human-first decision; AI prepares evidence", "Adversarial, repeated-run, tool-failure and rollback", "Complete traces plus policy and security events", "Redesign or tightly bounded shadow mode")
    if risk >= 11.1:
        return Recommendation(Posture.APPROVAL, "Approval before consequential action", "Representative, adversarial and repeated-run", "Full tool trace, cost, latency, retries and overrides", "Bounded pilot with named owner")
    if risk >= 8.1:
        return Recommendation(Posture.RECOMMEND, "Human decision at workflow boundary", "Representative cases, edge cases and regression", "Inputs, outputs, retrieval, tool calls and overrides", "Pilot with review cadence")
    if risk >= 5.6:
        return Recommendation(Posture.ASSIST, "Human acts; AI prepares", "Functional, groundedness and regression", "Source attribution, latency and feedback", "Limited release with monitored adoption")
    return Recommendation(Posture.AUTONOMOUS, "Human owns policy and exceptions", "Regression, drift and tool-state coverage", "Action trace, exceptions, cost and latency", "Canary release with automatic fallback")

if __name__ == "__main__":
    print(recommend(Scenario(3, 4, 3, 3)))
