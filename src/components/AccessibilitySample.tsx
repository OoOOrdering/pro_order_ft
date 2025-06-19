export default function AccessibilitySample() {
  return (
    <form aria-label="접근성 샘플 폼">
      <label htmlFor="name">이름</label>
      <input id="name" name="name" aria-required="true" />
      <button type="submit" aria-label="제출">제출</button>
    </form>
  );
}
