import { describe, expect, it } from "vitest";
import { getMapsUrl, getTimeLeft, getWazeUrl, weddingDate } from "./invitation";

describe("invitation configuration", () => {
  it("calculates days, hours and minutes until the celebration", () => {
    const oneDayAndTwoHoursLater = weddingDate.getTime() - (26 * 60 + 17) * 60 * 1000;
    expect(getTimeLeft(oneDayAndTwoHoursLater)).toEqual({ days: 1, hours: 2, minutes: 17 });
  });

  it("generates navigation links for the real venue", () => {
    expect(getMapsUrl()).toContain("Recanto%20Colonial");
    expect(getMapsUrl()).toContain("-14.067742347717285");
    expect(getWazeUrl()).toBe("https://waze.com/ul?ll=-14.067742347717285,-42.90986633300781&navigate=yes");
  });
});
