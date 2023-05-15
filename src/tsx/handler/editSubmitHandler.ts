
export const handleEditSubmit = (event: any) => {
  if (event.record.NeedToUpdate.value.length === 0) {
    event.record.NeedToUpdate.value.push('要反映');
  }
  return event;
};
