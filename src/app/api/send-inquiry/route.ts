import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { businessName, contact, address, tableCount, preferredTimeSlot, marketingConsent, serviceConsent, privacyConsent } = await req.json();

  // 환경 변수 검증
  const mailHost = process.env.MAIL_HOST;
  const mailPort = process.env.MAIL_PORT;
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;
  const mailTo = process.env.MAIL_TO;

  if (!mailHost || !mailUser || !mailPass || !mailTo) {
    console.error('필수 환경 변수가 설정되지 않았습니다:', {
      host: mailHost ? '설정됨' : '미설정',
      user: mailUser ? '설정됨' : '미설정',
      pass: mailPass ? '설정됨' : '미설정',
      to: mailTo ? '설정됨' : '미설정'
    });
    return NextResponse.json({ 
      ok: false, 
      error: '서버 설정 오류: SMTP 설정이 완료되지 않았습니다.' 
    }, { status: 500 });
  }

  // nodemailer transporter 설정
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: Number(mailPort) || 465,
    secure: true,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 시간대 매핑
  const timeSlotMap: { [key: string]: string } = {
    'anytime': '언제든 상관없음',
    'morning1': '오전 (09:00 - 10:00)',
    'morning2': '오전 (10:00 - 11:00)',
    'morning3': '오전 (11:00 - 12:00)',
    'afternoon1': '오후 (13:00 - 14:00)',
    'afternoon2': '오후 (14:00 - 15:00)',
    'afternoon3': '오후 (15:00 - 16:00)',
    'afternoon4': '오후 (16:00 - 17:00)',
    'afternoon5': '오후 (17:00 - 18:00)'
  };

  // 메일 제목/본문(HTML) 구성
  const mailOptions = {
    from: `하이오더 문의 <${mailUser}>`,
    to: mailTo,
    subject: `[하이오더 문의] ${contact}님의 상담 신청`,
    html: `
      <div style="font-family: Pretendard, Arial, sans-serif; padding: 24px;">
        <h2 style="color: #FF8000;">하이오더 신규 설치 상담 신청</h2>
        <p><b>상호명 or 성명:</b> ${businessName}</p>
        <p><b>연락처:</b> ${contact}</p>
        <p><b>주소:</b> ${address}</p>
        <p><b>테이블 개수:</b> ${tableCount}개</p>
        <p><b>희망 시간대:</b> ${timeSlotMap[preferredTimeSlot] || preferredTimeSlot}</p>
        <p><b>광고성 정보 수신 동의:</b> ${marketingConsent ? '동의' : '미동의'}</p>
        <p><b>서비스/이벤트 정보 제공 동의:</b> ${serviceConsent ? '동의' : '미동의'}</p>
        <p><b>개인정보 수집·이용 동의:</b> ${privacyConsent ? '동의' : '미동의'}</p>
        <hr style="margin: 24px 0;"/>
        <small>본 메일은 하이오더 홈페이지에서 자동 발송되었습니다.</small>
      </div>
    `,
  };

  try {
    // 환경변수 확인 (개발용 로그)
    console.log('SMTP 설정 확인:', {
      host: mailHost,
      port: mailPort,
      user: mailUser,
      pass: mailPass ? '***' : '미설정',
      to: mailTo
    });
    
    // 실제 이메일 전송
    await transporter.sendMail(mailOptions);
    console.log('이메일 전송 성공!');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('이메일 전송 실패:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
} 