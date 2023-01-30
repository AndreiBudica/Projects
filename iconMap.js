export { ICON_MAP };
const ICON_MAP = new Map();
addMapping([0], "sun-solid.svg");
addMapping([1, 2, 3], "cloud-sun-solid.svg");
addMapping([45, 48, 51, 53, 55, 56, 57], "smog-solid.svg");
addMapping(
  [61, 63, 65, 66, 67, 80, 81, 81, 96, 95, 99],
  "cloud-showers-heavy-solid.svg"
);
addMapping([71, 73, 75, 77, 85, 86], "snowflake-solid.svg");

function addMapping(values, icon) {
  values.forEach((value) => {
    ICON_MAP.set(value, icon);
  });
}
