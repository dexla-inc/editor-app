import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { getAllIds } from "@/libs/dnd-grid/utils/editor";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  getBaseElement,
  getBaseElementId,
} from "@/libs/dnd-grid/utils/engines/finder";

// Define the structure of the result returned by getGridCoordinates
interface GridCoordinateResult {
  column: number;
  row: number;
  parentId: string;
}

/**
 * Retrieves all elements at a given point relative to a specific container element.
 *
 * @param {HTMLElement} container - The container element within which to search.
 * @param {number} x - The X coordinate relative to the container.
 * @param {number} y - The Y coordinate relative to the container.
 * @returns {HTMLElement[]} - An array of elements found at the specified point within the container.
 */
function elementsFromPointWithin(container: HTMLElement, x: number, y: number) {
  // console.log("elementsFromPointWithin", container);
  const rect = container.getBoundingClientRect();
  const viewportX = rect.left + x;
  const viewportY = rect.top + y;
  const allElements = document.elementsFromPoint(viewportX, viewportY);
  return [
    container,
    ...allElements.filter((element) => container.contains(element)),
  ];
}

/**
 * Get all elements under a specific point that are valid component IDs.
 * @param x - Mouse X coordinate
 * @param y - Mouse Y coordinate
 * @returns Array of elements under the point that are valid components
 */
export const getElementsOver = (x: number, y: number): Element[] => {
  const { tree: editorTree } = useEditorTreeStore.getState();
  const components = editorTree.root;
  const { iframeWindow } = useEditorStore.getState();
  const allIds = getAllIds(components);
  const baseElementId = getBaseElementId();

  const containerContext =
    iframeWindow?.document.getElementById(baseElementId)!;

  return elementsFromPointWithin(containerContext, x, y).filter((el: Element) =>
    allIds.some((id) => el.id.startsWith(id)),
  ) as Element[];
};

/**
 * Calculate grid coordinates based on mouse position and current element
 * @param currentId - ID of the current element being dragged
 * @param x - Mouse X coordinate
 * @param y - Mouse Y coordinate
 * @param forceDropZone - Optional element to force as drop zone
 * @returns GridCoordinateResult object with column, row, and parentId
 */
export const getGridCoordinates = (
  currentId: string,
  x: number,
  y: number,
  forceDropZone: HTMLDivElement | null = null,
): GridCoordinateResult => {
  // Normalize currentId, treating 'main-grid' as an empty string
  const normalizedCurrentId = currentId === "main-grid" ? "" : currentId;

  // Get the element that will serve as the drop zone
  const dropZoneElement = getDropZoneElement(
    normalizedCurrentId,
    x,
    y,
    forceDropZone,
  );

  // Handle the case when no drop zone is found
  if (!dropZoneElement) {
    return {
      column: 1,
      row: 1,
      parentId: getBaseElementId().replace("-body", ""),
    };
  }

  // Calculate the grid position within the drop zone
  const { column, row } = calculateGridPosition(dropZoneElement, x, y);

  return {
    column,
    row,
    parentId: dropZoneElement.id.replace("-body", ""),
  };
};

/**
 * Determine the drop zone element based on current position and valid targets
 * @param currentId - ID of the current element being dragged
 * @param x - Mouse X coordinate
 * @param y - Mouse Y coordinate
 * @param forceDropZone - Optional element to force as drop zone
 * @returns HTMLElement or null to serve as the drop zone
 */
const getDropZoneElement = (
  currentId: string,
  x: number,
  y: number,
  forceDropZone: HTMLDivElement | null,
): HTMLElement | null => {
  // If a forced drop zone is provided, use it
  if (forceDropZone) return forceDropZone;

  // Get all elements under the point that are valid component IDs
  const elementsOver = getElementsOver(x, y);

  // Filter elements to find valid drop zones
  const validDropZones = elementsOver.filter((el) =>
    isValidDropZone(el as HTMLElement, currentId),
  );

  // Return the first valid drop zone found, or null if none
  return validDropZones.length > 0 ? (validDropZones[0] as HTMLElement) : null;
};

/**
 * Check if an element is a valid drop zone
 * @param el - Element to check
 * @param currentId - ID of the current element being dragged
 * @returns boolean indicating if the element is a valid drop zone
 */
const isValidDropZone = (el: HTMLElement, currentId: string): boolean => {
  const { iframeWindow } = useEditorStore.getState();
  const elId = el.id;
  // Exclude the current element
  if (elId === currentId) return false;

  const currentElement = iframeWindow?.document.getElementById(currentId);
  if (!currentElement) return false;

  // Get bounding rectangles for both elements
  const elRect = el.getBoundingClientRect();
  const currentRect = currentElement.getBoundingClientRect();

  // Check if the current element fits inside the potential drop zone
  return (
    currentRect.left >= elRect.left &&
    currentRect.right <= elRect.right &&
    currentRect.top >= elRect.top &&
    currentRect.bottom <= elRect.bottom
  );
};

/**
 * Calculate the grid position within a drop zone element
 * @param dropZoneElement - Element serving as the drop zone
 * @param x - Mouse X coordinate
 * @param y - Mouse Y coordinate
 * @returns Object with calculated column and row
 */
const calculateGridPosition = (
  dropZoneElement: HTMLElement,
  x: number,
  y: number,
) => {
  const rect = dropZoneElement.getBoundingClientRect();
  const style = getComputedStyle(dropZoneElement);
  // Determine the number of columns and rows in the grid
  const gridColumns = style.gridTemplateColumns.split(" ").length;
  const gridRows = Math.round(rect.height / 10);

  // Calculate the width and height of each grid cell
  const columnWidth = rect.width / gridColumns;
  const rowHeight = rect.height / gridRows;

  // Calculate the column and row based on mouse position, ensuring a minimum of 1
  const column = Math.max(1, Math.floor((x - rect.left) / columnWidth) + 1);
  const row = Math.max(1, Math.floor((y - rect.top) / rowHeight) + 1);

  return { column, row };
};
