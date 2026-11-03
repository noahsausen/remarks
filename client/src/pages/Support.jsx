import '../../src/App.css';

export default function Support() {
  return (
    <div className="Support">
      <h1>Support</h1>
      <p>Due to limited development time, many features common in social media apps have not been implemented yet.
        It's likely that features will be added or improved at some point, but there are no timelines.</p>
      <p>Despite this, we understand that users may want to make changes like the following:</p>
      <ul>
        <li>Changing or forgot password</li>
        <li>Changing email or username (changing username may not be possible)</li>
        <li>Deleting an account</li>
        <li>Deleting or editing posts</li>
        <li>Reporting inappropriate and/or disorderly activity</li>
      </ul>
      <p>In this case, we can manually make database edits if you contact support.</p>
      <p>Finally, if you have feedback or find bugs/vulnerabilities, please contact support so we can improve the Remarks experience for everyone and ensure the highest level of security.</p>
      <h4>To contact support, please email <a className="WhiteLink" href="mailto:noahsausen@gmail.com">noahsausen@gmail.com</a>.</h4>
    </div>
  );
}